"""
품질관리 API — PPM 추적, 불량 현황, 고객 클레임
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from app.core.database import get_db

router = APIRouter(prefix="/quality", tags=["품질관리"])

PRODUCT_TYPES = ["BUSH", "댐퍼", "혼플레이트", "방진AS", "이너씰", "순고무"]


@router.get("/ppm")
async def get_ppm_summary(
    year_month: str = Query(...),
    db: AsyncSession = Depends(get_db)
):
    """제품 유형별 PPM 현황"""
    sql = text("""
        SELECT
            product_type,
            SUM(inspection_qty)                     AS inspection_qty,
            SUM(defect_qty)                         AS defect_qty,
            ROUND(
                CASE WHEN SUM(inspection_qty) > 0
                THEN SUM(defect_qty)::NUMERIC / SUM(inspection_qty) * 1000000
                ELSE 0 END, 0
            )                                       AS ppm,
            SUM(defect_amount)                      AS defect_amount,
            SUM(rework_qty)                         AS rework_qty,
            SUM(rework_amount)                      AS rework_amount
        FROM quality_defect_log
        WHERE year_month = :ym
        GROUP BY product_type
        ORDER BY SUM(defect_amount) DESC
    """)
    result = await db.execute(sql, {"ym": year_month})
    return [dict(r) for r in result.mappings().all()]


@router.get("/ppm/detail")
async def get_ppm_detail(
    year_month: str = Query(...),
    product_type: str = Query(...),
    db: AsyncSession = Depends(get_db)
):
    """품번별 불량 상세"""
    sql = text("""
        SELECT
            part_number,
            week_num,
            inspection_qty,
            defect_qty,
            ROUND(
                CASE WHEN inspection_qty > 0
                THEN defect_qty::NUMERIC / inspection_qty * 1000000
                ELSE 0 END, 0
            ) AS ppm,
            defect_amount,
            defect_type,
            rework_qty,
            rework_amount,
            notes
        FROM quality_defect_log
        WHERE year_month = :ym AND product_type = :pt
        ORDER BY defect_amount DESC
    """)
    result = await db.execute(sql, {"ym": year_month, "pt": product_type})
    return [dict(r) for r in result.mappings().all()]


@router.get("/ppm/trend")
async def get_ppm_trend(
    product_type: str = Query(...),
    months: int = Query(6),
    db: AsyncSession = Depends(get_db)
):
    """PPM 월별 추이"""
    sql = text("""
        SELECT
            year_month,
            product_type,
            SUM(inspection_qty) AS inspection_qty,
            SUM(defect_qty)     AS defect_qty,
            ROUND(
                CASE WHEN SUM(inspection_qty) > 0
                THEN SUM(defect_qty)::NUMERIC / SUM(inspection_qty) * 1000000
                ELSE 0 END, 0
            ) AS ppm
        FROM quality_defect_log
        WHERE product_type = :pt
        GROUP BY year_month, product_type
        ORDER BY year_month DESC
        LIMIT :months
    """)
    result = await db.execute(sql, {"pt": product_type, "months": months})
    return [dict(r) for r in result.mappings().all()]


@router.post("/defect")
async def create_defect_log(body: dict, db: AsyncSession = Depends(get_db)):
    """불량 데이터 등록"""
    # PPM 자동 계산
    insp = body.get("inspection_qty", 0) or 0
    defect = body.get("defect_qty", 0) or 0
    ppm = round(defect / insp * 1_000_000, 2) if insp > 0 else 0

    sql = text("""
        INSERT INTO quality_defect_log (
            year_month, week_num, product_type, part_number,
            inspection_qty, defect_qty, ppm, defect_amount,
            defect_type, rework_qty, rework_amount, notes
        ) VALUES (
            :year_month, :week_num, :product_type, :part_number,
            :inspection_qty, :defect_qty, :ppm, :defect_amount,
            :defect_type, :rework_qty, :rework_amount, :notes
        ) RETURNING id
    """)
    result = await db.execute(sql, {
        "year_month":     body["year_month"],
        "week_num":       body.get("week_num"),
        "product_type":   body["product_type"],
        "part_number":    body.get("part_number"),
        "inspection_qty": insp,
        "defect_qty":     defect,
        "ppm":            ppm,
        "defect_amount":  body.get("defect_amount", 0),
        "defect_type":    body.get("defect_type"),
        "rework_qty":     body.get("rework_qty", 0),
        "rework_amount":  body.get("rework_amount", 0),
        "notes":          body.get("notes"),
    })
    await db.commit()
    return {"id": result.scalar(), "ppm": ppm}


# ── 고객 클레임 ───────────────────────────────────────────────────

@router.get("/claims")
async def get_claims(
    status: str = Query(None),
    db: AsyncSession = Depends(get_db)
):
    where = "WHERE status = :status" if status else ""
    sql = text(f"""
        SELECT * FROM customer_claims
        {where}
        ORDER BY claim_date DESC
        LIMIT 100
    """)
    result = await db.execute(sql, {"status": status} if status else {})
    return [dict(r) for r in result.mappings().all()]


@router.post("/claims")
async def create_claim(body: dict, db: AsyncSession = Depends(get_db)):
    sql = text("""
        INSERT INTO customer_claims (
            claim_date, customer_name, product_type, part_number,
            claim_type, qty, amount, status, action_plan
        ) VALUES (
            :claim_date, :customer_name, :product_type, :part_number,
            :claim_type, :qty, :amount, 'open', :action_plan
        ) RETURNING id
    """)
    result = await db.execute(sql, {
        "claim_date":    body["claim_date"],
        "customer_name": body["customer_name"],
        "product_type":  body.get("product_type"),
        "part_number":   body.get("part_number"),
        "claim_type":    body.get("claim_type"),
        "qty":           body.get("qty", 0),
        "amount":        body.get("amount", 0),
        "action_plan":   body.get("action_plan"),
    })
    await db.commit()
    return {"id": result.scalar()}
