"""
재고 관리 API — 입출고 · 안전재고 · 재고 현황
"""

from datetime import date, datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
import structlog

from app.core.database import get_db

router = APIRouter(prefix="/inventory", tags=["재고관리"])
log = structlog.get_logger(__name__)


# ── 재고 현황 조회 ────────────────────────────────────────────

@router.get("/items")
async def list_items(
    category: Optional[str] = Query(None),
    alert_only: bool = Query(False, description="안전재고 미달 품목만"),
    search: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """재고 품목 목록"""
    where = ["1=1"]
    params: dict = {}

    if category:
        where.append("category = :category")
        params["category"] = category
    if alert_only:
        where.append("current_qty < safety_qty")
    if search:
        where.append("(name ILIKE :s OR code ILIKE :s)")
        params["s"] = f"%{search}%"

    sql = text(f"""
        SELECT
            id, code, name, category, unit,
            current_qty, safety_qty, unit_price,
            ROUND(current_qty * unit_price) AS stock_value,
            location, supplier, notes,
            updated_at
        FROM inventory_items
        WHERE {' AND '.join(where)}
        ORDER BY category, name
    """)
    result = await db.execute(sql, params)
    rows = result.mappings().all()

    out = []
    for r in rows:
        d = dict(r)
        ratio = (d["current_qty"] / d["safety_qty"]) if d["safety_qty"] > 0 else 999
        d["stock_status"] = "danger" if ratio <= 0.5 else "warning" if ratio < 1 else "ok"
        d["stock_ratio"]  = round(ratio, 2)
        out.append(d)
    return out


@router.get("/items/{item_id}")
async def get_item(item_id: int, db: AsyncSession = Depends(get_db)):
    sql = text("SELECT * FROM inventory_items WHERE id = :id")
    result = await db.execute(sql, {"id": item_id})
    row = result.mappings().first()
    if not row:
        raise HTTPException(status_code=404, detail="품목 없음")
    return dict(row)


@router.get("/summary")
async def get_summary(db: AsyncSession = Depends(get_db)):
    """재고 요약 (전체/카테고리별)"""
    sql = text("""
        SELECT
            category,
            COUNT(*)                                    AS item_count,
            SUM(current_qty * unit_price)               AS total_value,
            COUNT(*) FILTER (WHERE current_qty < safety_qty) AS alert_count
        FROM inventory_items
        GROUP BY category
        ORDER BY category
    """)
    result = await db.execute(sql)
    return [dict(r) for r in result.mappings().all()]


# ── 입출고 이력 ───────────────────────────────────────────────

@router.get("/transactions")
async def list_transactions(
    item_id: Optional[int] = Query(None),
    tx_type: Optional[str] = Query(None),
    limit: int = Query(50, le=200),
    db: AsyncSession = Depends(get_db),
):
    where = ["1=1"]
    params: dict = {"limit": limit}
    if item_id:
        where.append("t.item_id = :item_id")
        params["item_id"] = item_id
    if tx_type:
        where.append("t.tx_type = :tx_type")
        params["tx_type"] = tx_type

    sql = text(f"""
        SELECT
            t.id, t.tx_date, t.tx_type,
            i.code AS item_code, i.name AS item_name, i.unit,
            t.qty, t.before_qty, t.after_qty,
            t.ref_no, t.manager, t.notes,
            t.created_at
        FROM inventory_transactions t
        JOIN inventory_items i ON t.item_id = i.id
        WHERE {' AND '.join(where)}
        ORDER BY t.tx_date DESC, t.id DESC
        LIMIT :limit
    """)
    result = await db.execute(sql, params)
    return [dict(r) for r in result.mappings().all()]


@router.post("/transactions")
async def create_transaction(body: dict, db: AsyncSession = Depends(get_db)):
    """입출고 처리 (재고 수량 자동 반영)"""
    item_id = body["item_id"]
    qty     = int(body["qty"])
    tx_type = body["tx_type"]  # 입고 | 출고 | 재고조정

    # 현재 재고 조회
    cur_sql = text("SELECT current_qty FROM inventory_items WHERE id = :id FOR UPDATE")
    cur_result = await db.execute(cur_sql, {"id": item_id})
    cur_row = cur_result.mappings().first()
    if not cur_row:
        raise HTTPException(status_code=404, detail="품목 없음")

    before_qty = cur_row["current_qty"]

    if tx_type == "입고":
        after_qty = before_qty + qty
    elif tx_type == "출고":
        after_qty = before_qty - qty
        if after_qty < 0:
            raise HTTPException(status_code=400, detail="재고 부족")
    elif tx_type == "재고조정":
        after_qty = qty  # 절대값으로 조정
    else:
        raise HTTPException(status_code=400, detail="tx_type 오류 (입고|출고|재고조정)")

    # 트랜잭션 기록
    tx_sql = text("""
        INSERT INTO inventory_transactions
            (item_id, tx_date, tx_type, qty, before_qty, after_qty, ref_no, manager, notes)
        VALUES
            (:item_id, :tx_date, :tx_type, :qty, :before_qty, :after_qty, :ref_no, :manager, :notes)
        RETURNING id
    """)
    tx_result = await db.execute(tx_sql, {
        "item_id":    item_id,
        "tx_date":    body.get("tx_date", date.today().isoformat()),
        "tx_type":    tx_type,
        "qty":        qty,
        "before_qty": before_qty,
        "after_qty":  after_qty,
        "ref_no":     body.get("ref_no", ""),
        "manager":    body.get("manager", ""),
        "notes":      body.get("notes", ""),
    })

    # 재고 수량 업데이트
    upd_sql = text("UPDATE inventory_items SET current_qty = :qty, updated_at = NOW() WHERE id = :id")
    await db.execute(upd_sql, {"qty": after_qty, "id": item_id})
    await db.commit()

    return {"success": True, "id": tx_result.scalar(), "before_qty": before_qty, "after_qty": after_qty}


# ── 품목 마스터 관리 ──────────────────────────────────────────

@router.post("/items")
async def create_item(body: dict, db: AsyncSession = Depends(get_db)):
    sql = text("""
        INSERT INTO inventory_items
            (code, name, category, unit, current_qty, safety_qty, unit_price, location, supplier, notes)
        VALUES
            (:code, :name, :category, :unit, :current_qty, :safety_qty, :unit_price, :location, :supplier, :notes)
        RETURNING id
    """)
    result = await db.execute(sql, {
        "code":        body["code"],
        "name":        body["name"],
        "category":    body.get("category", "원자재"),
        "unit":        body.get("unit", "EA"),
        "current_qty": body.get("current_qty", 0),
        "safety_qty":  body.get("safety_qty", 0),
        "unit_price":  body.get("unit_price", 0),
        "location":    body.get("location", ""),
        "supplier":    body.get("supplier", ""),
        "notes":       body.get("notes", ""),
    })
    await db.commit()
    return {"success": True, "id": result.scalar()}


@router.put("/items/{item_id}")
async def update_item(item_id: int, body: dict, db: AsyncSession = Depends(get_db)):
    sql = text("""
        UPDATE inventory_items SET
            name = :name, category = :category, unit = :unit,
            safety_qty = :safety_qty, unit_price = :unit_price,
            location = :location, supplier = :supplier, notes = :notes,
            updated_at = NOW()
        WHERE id = :id
    """)
    await db.execute(sql, {
        "id":         item_id,
        "name":       body.get("name"),
        "category":   body.get("category"),
        "unit":       body.get("unit"),
        "safety_qty": body.get("safety_qty", 0),
        "unit_price": body.get("unit_price", 0),
        "location":   body.get("location", ""),
        "supplier":   body.get("supplier", ""),
        "notes":      body.get("notes", ""),
    })
    await db.commit()
    return {"success": True}
