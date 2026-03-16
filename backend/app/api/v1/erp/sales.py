"""
영업관리 API — 고객사별 매출 실적, HKMC OEM 진도
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from app.core.database import get_db

router = APIRouter(prefix="/sales", tags=["영업관리"])

CUSTOMER_SEGMENTS = ["자동차", "삼익THK", "평화산업", "SECOAIA"]


@router.get("/performance")
async def get_sales_performance(
    year_month: str = Query(...),
    db: AsyncSession = Depends(get_db)
):
    """고객사별 매출 실적"""
    sql = text("""
        SELECT
            customer_segment,
            target_amt,
            actual_amt,
            shortfall_amt,
            ROUND(
                CASE WHEN target_amt > 0
                THEN actual_amt::NUMERIC / target_amt * 100
                ELSE 0 END, 1
            ) AS achievement,
            key_issues,
            action_plan
        FROM sales_performance
        WHERE year_month = :ym
        ORDER BY target_amt DESC
    """)
    result = await db.execute(sql, {"ym": year_month})
    rows = [dict(r) for r in result.mappings().all()]

    total = {
        "target_amt":    sum(r["target_amt"] or 0 for r in rows),
        "actual_amt":    sum(r["actual_amt"] or 0 for r in rows),
        "shortfall_amt": sum(r["shortfall_amt"] or 0 for r in rows),
    }
    if total["target_amt"] > 0:
        total["achievement"] = round(total["actual_amt"] / total["target_amt"] * 100, 1)

    return {"year_month": year_month, "rows": rows, "total": total}


@router.post("/performance")
async def upsert_sales_performance(body: dict, db: AsyncSession = Depends(get_db)):
    target = body.get("target_amt", 0) or 0
    actual = body.get("actual_amt", 0) or 0
    shortfall = actual - target  # 음수 = 미달

    sql = text("""
        INSERT INTO sales_performance (
            year_month, customer_segment,
            target_amt, actual_amt, shortfall_amt, achievement,
            key_issues, action_plan
        ) VALUES (
            :year_month, :customer_segment,
            :target_amt, :actual_amt, :shortfall_amt, :achievement,
            :key_issues, :action_plan
        )
        ON CONFLICT (year_month, customer_segment)
        DO UPDATE SET
            target_amt       = EXCLUDED.target_amt,
            actual_amt       = EXCLUDED.actual_amt,
            shortfall_amt    = EXCLUDED.shortfall_amt,
            achievement      = EXCLUDED.achievement,
            key_issues       = EXCLUDED.key_issues,
            action_plan      = EXCLUDED.action_plan
        RETURNING id
    """)
    result = await db.execute(sql, {
        "year_month":        body["year_month"],
        "customer_segment":  body["customer_segment"],
        "target_amt":        target,
        "actual_amt":        actual,
        "shortfall_amt":     shortfall,
        "achievement":       round(actual / target * 100, 1) if target > 0 else 0,
        "key_issues":        body.get("key_issues"),
        "action_plan":       body.get("action_plan"),
    })
    await db.commit()
    return {"id": result.scalar()}


@router.get("/hkmc-progress")
async def get_hkmc_progress(
    base_date: str = Query(None),
    db: AsyncSession = Depends(get_db)
):
    """HKMC OEM 계획 대비 생산 실적"""
    where = "WHERE base_date = :bd" if base_date else "WHERE base_date = (SELECT MAX(base_date) FROM hkmc_production_progress)"
    sql = text(f"""
        SELECT vehicle_model, plant, monthly_plan, actual_qty, achievement, notes
        FROM hkmc_production_progress
        {where}
        ORDER BY vehicle_model, plant
    """)
    params = {"bd": base_date} if base_date else {}
    result = await db.execute(sql, params)
    return [dict(r) for r in result.mappings().all()]


@router.get("/performance/trend")
async def get_sales_trend(
    customer_segment: str = Query(None),
    months: int = Query(6),
    db: AsyncSession = Depends(get_db)
):
    where = "AND customer_segment = :cs" if customer_segment else ""
    sql = text(f"""
        SELECT year_month, customer_segment, target_amt, actual_amt,
               ROUND(
                   CASE WHEN target_amt > 0
                   THEN actual_amt::NUMERIC / target_amt * 100
                   ELSE 0 END, 1
               ) AS achievement
        FROM sales_performance
        WHERE 1=1 {where}
        ORDER BY year_month DESC, target_amt DESC
        LIMIT :lim
    """)
    params = {"lim": months * 10}
    if customer_segment:
        params["cs"] = customer_segment
    result = await db.execute(sql, params)
    return [dict(r) for r in result.mappings().all()]
