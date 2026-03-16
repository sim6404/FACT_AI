"""
매입관리 API — 월별매출대비매입현황분석
핵심 비즈니스 로직: 목표매출 × 표준매입비율 × 75% = 매입 목표
"""

from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
import structlog

from app.core.database import get_db

router = APIRouter(prefix="/purchase", tags=["매입관리"])
log = structlog.get_logger(__name__)


# ── 조회 ──────────────────────────────────────────────────────────

@router.get("/analysis")
async def get_purchase_analysis(
    year_month: str = Query(..., description="조회 년월 (YYYY-MM)"),
    db: AsyncSession = Depends(get_db)
):
    """월별매출대비매입현황분석 — 전 제품라인 조회"""
    sql = text("""
        SELECT
            psa.id,
            psa.year_month,
            pl.code          AS product_code,
            pl.name          AS product_name,
            s.name           AS supplier_name,
            s.code           AS supplier_code,
            psa.sales_target,
            psa.std_purchase_ratio,
            psa.std_purchase_amt,
            psa.review_purchase_amt,
            psa.purchase_target_75,
            psa.actual_sales,
            psa.appropriate_purchase,
            psa.excess_vs_target,
            psa.purchase_achievement,
            psa.prev_stock_amt,
            psa.carryover_amt,
            psa.week1_purchase,
            psa.week2_purchase,
            psa.week3_purchase,
            psa.week4_purchase,
            psa.week5_purchase,
            psa.total_purchase,
            psa.notes
        FROM purchase_sales_analysis psa
        JOIN product_lines pl ON psa.product_line_id = pl.id
        JOIN suppliers s      ON psa.supplier_id = s.id
        WHERE psa.year_month = :ym
        ORDER BY s.name, pl.name
    """)
    result = await db.execute(sql, {"ym": year_month})
    rows = result.mappings().all()

    # 총합 계산
    total = {
        "sales_target": sum(r["sales_target"] or 0 for r in rows),
        "purchase_target_75": sum(r["purchase_target_75"] or 0 for r in rows),
        "actual_sales": sum(r["actual_sales"] or 0 for r in rows),
        "total_purchase": sum(r["total_purchase"] or 0 for r in rows),
        "week1_purchase": sum(r["week1_purchase"] or 0 for r in rows),
        "week2_purchase": sum(r["week2_purchase"] or 0 for r in rows),
        "week3_purchase": sum(r["week3_purchase"] or 0 for r in rows),
        "week4_purchase": sum(r["week4_purchase"] or 0 for r in rows),
        "week5_purchase": sum(r["week5_purchase"] or 0 for r in rows),
    }
    if total["purchase_target_75"] > 0:
        total["achievement_pct"] = round(total["total_purchase"] / total["purchase_target_75"] * 100, 1)
    else:
        total["achievement_pct"] = 0.0

    return {
        "year_month": year_month,
        "rows": [dict(r) for r in rows],
        "total": total
    }


@router.get("/analysis/summary")
async def get_purchase_summary(
    year_month: Optional[str] = Query(None, description="특정 년월 (YYYY-MM)"),
    months: int = Query(3, description="최근 N개월 (year_month 미지정 시)"),
    db: AsyncSession = Depends(get_db)
):
    """매입 현황 요약 — year_month 지정 시 해당 월 단건, 없으면 최근 N개월"""
    if year_month:
        sql = text("""
            SELECT
                :ym                           AS year_month,
                SUM(sales_target)             AS total_sales_target,
                SUM(std_purchase_amt)         AS total_std_purchase_amt,
                SUM(purchase_target_75)       AS total_purchase_target_75,
                SUM(total_purchase)           AS total_actual_purchase,
                ROUND(
                    CASE WHEN SUM(purchase_target_75) > 0
                    THEN SUM(total_purchase)::NUMERIC / SUM(purchase_target_75) * 100
                    ELSE 0 END, 1
                )                             AS avg_achievement_pct,
                COUNT(DISTINCT supplier_id)   AS supplier_count
            FROM purchase_sales_analysis
            WHERE year_month = :ym
        """)
        result = await db.execute(sql, {"ym": year_month})
        row = result.mappings().first()
        return dict(row) if row else {
            "year_month": year_month,
            "total_sales_target": 0,
            "total_std_purchase_amt": 0,
            "total_purchase_target_75": 0,
            "total_actual_purchase": 0,
            "avg_achievement_pct": 0.0,
            "supplier_count": 0,
        }
    else:
        sql = text("""
            SELECT
                year_month,
                SUM(sales_target)       AS total_sales_target,
                SUM(purchase_target_75) AS total_purchase_target_75,
                SUM(total_purchase)     AS total_actual_purchase,
                ROUND(
                    CASE WHEN SUM(purchase_target_75) > 0
                    THEN SUM(total_purchase)::NUMERIC / SUM(purchase_target_75) * 100
                    ELSE 0 END, 1
                ) AS avg_achievement_pct,
                COUNT(DISTINCT supplier_id) AS supplier_count
            FROM purchase_sales_analysis
            GROUP BY year_month
            ORDER BY year_month DESC
            LIMIT :months
        """)
        result = await db.execute(sql, {"months": months})
        return [dict(r) for r in result.mappings().all()]


@router.get("/analysis/suppliers")
async def get_by_supplier(
    year_month: str = Query(...),
    db: AsyncSession = Depends(get_db)
):
    """공급업체별 매입 현황"""
    sql = text("""
        SELECT
            s.code, s.name AS supplier_name,
            SUM(psa.sales_target)       AS sales_target,
            SUM(psa.purchase_target_75) AS purchase_target,
            SUM(psa.total_purchase)     AS total_purchase,
            ROUND(
                CASE WHEN SUM(psa.purchase_target_75) > 0
                THEN SUM(psa.total_purchase)::NUMERIC / SUM(psa.purchase_target_75) * 100
                ELSE 0 END, 1
            ) AS achievement_pct
        FROM purchase_sales_analysis psa
        JOIN suppliers s ON psa.supplier_id = s.id
        WHERE psa.year_month = :ym
        GROUP BY s.id, s.code, s.name
        ORDER BY SUM(psa.sales_target) DESC
    """)
    result = await db.execute(sql, {"ym": year_month})
    return [dict(r) for r in result.mappings().all()]


# ── 입력/수정 ──────────────────────────────────────────────────────

@router.post("/analysis")
async def upsert_purchase_row(
    body: dict,
    db: AsyncSession = Depends(get_db)
):
    """매입현황 행 생성 또는 업데이트 (upsert)"""
    year_month = body["year_month"]
    product_line_id = body["product_line_id"]

    # 75% 목표 자동계산
    if "sales_target" in body and "std_purchase_ratio" in body:
        std_amt = int(body["sales_target"] * body["std_purchase_ratio"] / 100)
        target_75 = int(std_amt * 0.75)
        body.setdefault("std_purchase_amt", std_amt)
        body.setdefault("purchase_target_75", target_75)

    # 총 매입 자동합산
    weeks = ["week1_purchase", "week2_purchase", "week3_purchase",
             "week4_purchase", "week5_purchase"]
    total = sum(body.get(w, 0) or 0 for w in weeks)
    carryover = body.get("carryover_amt", 0) or 0
    body["total_purchase"] = total + carryover

    # 달성률
    if body.get("purchase_target_75", 0) > 0:
        body["purchase_achievement"] = round(
            body["total_purchase"] / body["purchase_target_75"] * 100, 1
        )

    upsert_sql = text("""
        INSERT INTO purchase_sales_analysis (
            year_month, product_line_id, supplier_id,
            sales_target, std_purchase_ratio, std_purchase_amt,
            review_purchase_amt, purchase_target_75,
            actual_sales, appropriate_purchase, excess_vs_target,
            purchase_achievement,
            prev_stock_amt, carryover_amt,
            week1_purchase, week2_purchase, week3_purchase,
            week4_purchase, week5_purchase,
            total_purchase, notes, updated_at
        ) VALUES (
            :year_month, :product_line_id, :supplier_id,
            :sales_target, :std_purchase_ratio, :std_purchase_amt,
            :review_purchase_amt, :purchase_target_75,
            :actual_sales, :appropriate_purchase, :excess_vs_target,
            :purchase_achievement,
            :prev_stock_amt, :carryover_amt,
            :week1_purchase, :week2_purchase, :week3_purchase,
            :week4_purchase, :week5_purchase,
            :total_purchase, :notes, NOW()
        )
        ON CONFLICT (year_month, product_line_id)
        DO UPDATE SET
            sales_target         = EXCLUDED.sales_target,
            std_purchase_ratio   = EXCLUDED.std_purchase_ratio,
            std_purchase_amt     = EXCLUDED.std_purchase_amt,
            review_purchase_amt  = EXCLUDED.review_purchase_amt,
            purchase_target_75   = EXCLUDED.purchase_target_75,
            actual_sales         = EXCLUDED.actual_sales,
            appropriate_purchase = EXCLUDED.appropriate_purchase,
            excess_vs_target     = EXCLUDED.excess_vs_target,
            purchase_achievement = EXCLUDED.purchase_achievement,
            prev_stock_amt       = EXCLUDED.prev_stock_amt,
            carryover_amt        = EXCLUDED.carryover_amt,
            week1_purchase       = EXCLUDED.week1_purchase,
            week2_purchase       = EXCLUDED.week2_purchase,
            week3_purchase       = EXCLUDED.week3_purchase,
            week4_purchase       = EXCLUDED.week4_purchase,
            week5_purchase       = EXCLUDED.week5_purchase,
            total_purchase       = EXCLUDED.total_purchase,
            notes                = EXCLUDED.notes,
            updated_at           = NOW()
        RETURNING id
    """)

    params = {
        "year_month": year_month,
        "product_line_id": product_line_id,
        "supplier_id": body.get("supplier_id"),
        "sales_target": body.get("sales_target", 0),
        "std_purchase_ratio": body.get("std_purchase_ratio"),
        "std_purchase_amt": body.get("std_purchase_amt", 0),
        "review_purchase_amt": body.get("review_purchase_amt", 0),
        "purchase_target_75": body.get("purchase_target_75", 0),
        "actual_sales": body.get("actual_sales", 0),
        "appropriate_purchase": body.get("appropriate_purchase", 0),
        "excess_vs_target": body.get("excess_vs_target", 0),
        "purchase_achievement": body.get("purchase_achievement"),
        "prev_stock_amt": body.get("prev_stock_amt", 0),
        "carryover_amt": body.get("carryover_amt", 0),
        "week1_purchase": body.get("week1_purchase", 0),
        "week2_purchase": body.get("week2_purchase", 0),
        "week3_purchase": body.get("week3_purchase", 0),
        "week4_purchase": body.get("week4_purchase", 0),
        "week5_purchase": body.get("week5_purchase", 0),
        "total_purchase": body.get("total_purchase", 0),
        "notes": body.get("notes"),
    }

    result = await db.execute(upsert_sql, params)
    await db.commit()
    return {"success": True, "id": result.scalar()}


@router.post("/analysis/bulk")
async def bulk_upsert(body: dict, db: AsyncSession = Depends(get_db)):
    """다중 행 일괄 저장"""
    rows = body.get("rows", [])
    count = 0
    for row in rows:
        await upsert_purchase_row(row, db)
        count += 1
    return {"saved": count}


# ── 제품라인/공급업체 마스터 ───────────────────────────────────────

@router.get("/product-lines")
async def get_product_lines(db: AsyncSession = Depends(get_db)):
    sql = text("""
        SELECT pl.id, pl.code, pl.name, pl.purchase_ratio,
               s.name AS supplier_name, s.code AS supplier_code
        FROM product_lines pl
        LEFT JOIN suppliers s ON pl.supplier_id = s.id
        WHERE pl.is_active = TRUE
        ORDER BY s.name, pl.name
    """)
    result = await db.execute(sql)
    return [dict(r) for r in result.mappings().all()]


@router.get("/suppliers")
async def get_suppliers(db: AsyncSession = Depends(get_db)):
    sql = text("SELECT * FROM suppliers WHERE is_active = TRUE ORDER BY name")
    result = await db.execute(sql)
    return [dict(r) for r in result.mappings().all()]
