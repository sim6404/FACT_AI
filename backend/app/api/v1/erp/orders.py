"""
수주 관리 API — 수주 접수 · 생산지시 · 납기 추적
"""

from datetime import datetime, date
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
import structlog

from app.core.database import get_db

router = APIRouter(prefix="/orders", tags=["수주관리"])
log = structlog.get_logger(__name__)


# ── 수주 조회 ─────────────────────────────────────────────────

@router.get("")
async def list_orders(
    status: Optional[str] = Query(None, description="상태 필터"),
    customer: Optional[str] = Query(None),
    year_month: Optional[str] = Query(None, description="YYYY-MM"),
    db: AsyncSession = Depends(get_db),
):
    """수주 목록 조회"""
    where = ["1=1"]
    params: dict = {}

    if status:
        where.append("o.status = :status")
        params["status"] = status
    if customer:
        where.append("o.customer_name ILIKE :customer")
        params["customer"] = f"%{customer}%"
    if year_month:
        where.append("TO_CHAR(o.order_date, 'YYYY-MM') = :ym")
        params["ym"] = year_month

    sql = text(f"""
        SELECT
            o.id, o.order_no, o.order_date, o.customer_name,
            o.product_name, o.product_code,
            o.qty, o.unit_price, o.total_amount,
            o.due_date, o.status, o.manager, o.notes,
            o.created_at, o.updated_at
        FROM sales_orders o
        WHERE {' AND '.join(where)}
        ORDER BY o.order_date DESC, o.id DESC
    """)
    result = await db.execute(sql, params)
    rows = result.mappings().all()

    today = date.today()
    out = []
    for r in rows:
        d = dict(r)
        if d.get("due_date"):
            delta = (d["due_date"] - today).days
            d["d_day"] = delta
        out.append(d)
    return out


@router.get("/summary")
async def get_order_summary(
    year_month: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """수주 현황 요약"""
    where = "1=1"
    params: dict = {}
    if year_month:
        where = "TO_CHAR(order_date, 'YYYY-MM') = :ym"
        params["ym"] = year_month

    sql = text(f"""
        SELECT
            COUNT(*)                                    AS total_count,
            COUNT(*) FILTER (WHERE status NOT IN ('납품완료','취소')) AS active_count,
            SUM(total_amount)                           AS total_amount,
            COUNT(*) FILTER (WHERE due_date - CURRENT_DATE <= 2
                              AND status NOT IN ('납품완료','취소'))  AS urgent_count
        FROM sales_orders
        WHERE {where}
    """)
    result = await db.execute(sql, params)
    row = result.mappings().first()
    return dict(row) if row else {}


@router.get("/{order_id}")
async def get_order(order_id: int, db: AsyncSession = Depends(get_db)):
    sql = text("SELECT * FROM sales_orders WHERE id = :id")
    result = await db.execute(sql, {"id": order_id})
    row = result.mappings().first()
    if not row:
        raise HTTPException(status_code=404, detail="수주 없음")
    return dict(row)


# ── 수주 생성/수정 ────────────────────────────────────────────

@router.post("")
async def create_order(body: dict, db: AsyncSession = Depends(get_db)):
    """수주 등록"""
    qty        = body.get("qty", 0)
    unit_price = body.get("unit_price", 0)
    total      = qty * unit_price

    sql = text("""
        INSERT INTO sales_orders
            (order_no, order_date, customer_name, product_name, product_code,
             qty, unit_price, total_amount, due_date, status, manager, notes)
        VALUES
            (:order_no, :order_date, :customer_name, :product_name, :product_code,
             :qty, :unit_price, :total_amount, :due_date, :status, :manager, :notes)
        RETURNING id
    """)
    params = {
        "order_no":      body.get("order_no", f"SO-{datetime.now().strftime('%Y%m%d%H%M%S')}"),
        "order_date":    body.get("order_date", date.today().isoformat()),
        "customer_name": body["customer_name"],
        "product_name":  body["product_name"],
        "product_code":  body.get("product_code", ""),
        "qty":           qty,
        "unit_price":    unit_price,
        "total_amount":  total,
        "due_date":      body.get("due_date"),
        "status":        body.get("status", "접수대기"),
        "manager":       body.get("manager", ""),
        "notes":         body.get("notes", ""),
    }
    result = await db.execute(sql, params)
    await db.commit()
    return {"success": True, "id": result.scalar()}


@router.patch("/{order_id}/status")
async def update_status(order_id: int, body: dict, db: AsyncSession = Depends(get_db)):
    """수주 상태 변경"""
    new_status = body.get("status")
    if not new_status:
        raise HTTPException(status_code=400, detail="status 필요")
    sql = text("UPDATE sales_orders SET status = :s, updated_at = NOW() WHERE id = :id")
    await db.execute(sql, {"s": new_status, "id": order_id})
    await db.commit()
    return {"success": True}


@router.put("/{order_id}")
async def update_order(order_id: int, body: dict, db: AsyncSession = Depends(get_db)):
    """수주 전체 수정"""
    qty        = body.get("qty", 0)
    unit_price = body.get("unit_price", 0)
    sql = text("""
        UPDATE sales_orders SET
            customer_name = :customer_name, product_name = :product_name,
            product_code = :product_code, qty = :qty, unit_price = :unit_price,
            total_amount = :total_amount, due_date = :due_date,
            status = :status, manager = :manager, notes = :notes, updated_at = NOW()
        WHERE id = :id
    """)
    await db.execute(sql, {
        "id": order_id,
        "customer_name": body.get("customer_name"),
        "product_name":  body.get("product_name"),
        "product_code":  body.get("product_code", ""),
        "qty":           qty,
        "unit_price":    unit_price,
        "total_amount":  qty * unit_price,
        "due_date":      body.get("due_date"),
        "status":        body.get("status", "접수대기"),
        "manager":       body.get("manager", ""),
        "notes":         body.get("notes", ""),
    })
    await db.commit()
    return {"success": True}


@router.delete("/{order_id}")
async def delete_order(order_id: int, db: AsyncSession = Depends(get_db)):
    sql = text("DELETE FROM sales_orders WHERE id = :id")
    await db.execute(sql, {"id": order_id})
    await db.commit()
    return {"success": True}
