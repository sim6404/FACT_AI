"""
생산관리 API — 주간/월간 생산 실적, OEE
"""

from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from app.core.database import get_db

router = APIRouter(prefix="/production", tags=["생산관리"])


@router.get("/weekly")
async def get_weekly_production(
    year_week:  Optional[str] = Query(None, description="YYYY-Www (예: 2026-W10)"),
    year_month: Optional[str] = Query(None, description="YYYY-MM — 해당 월 전체 주차"),
    line_code:  Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    """주간 생산 실적 — year_week 또는 year_month 기준"""
    if year_week:
        where = "pw.year_week = :yw"
        params: dict = {"yw": year_week}
    elif year_month:
        # year_week 는 'YYYY-Www' 형식 — LIKE 로 해당 월 주차 매칭
        where = "pw.year_week LIKE :ym"
        params = {"ym": f"{year_month[:4]}-W%"}
    else:
        return {"items": [], "summary": {}}

    line_cond = "AND pw.line_code = :lc" if line_code else ""
    if line_code:
        params["lc"] = line_code

    sql = text(f"""
        SELECT
            pw.id,
            pw.year_week,
            pw.line_code,
            pw.plan_qty,
            pw.actual_qty,
            ROUND(
                CASE WHEN pw.plan_qty > 0
                THEN pw.actual_qty::NUMERIC / pw.plan_qty * 100
                ELSE 0 END, 1
            )                        AS oee,
            pw.downtime_hours        AS total_downtime_h,
            pw.notes
        FROM production_weekly pw
        WHERE {where} {line_cond}
        ORDER BY pw.year_week, pw.line_code
    """)
    result = await db.execute(sql, params)
    rows = [dict(r) for r in result.mappings().all()]

    total_plan   = sum(r["plan_qty"] or 0 for r in rows)
    total_actual = sum(r["actual_qty"] or 0 for r in rows)
    achievement  = round(total_actual / total_plan * 100, 1) if total_plan > 0 else 0.0
    avg_oee      = round(sum(r["oee"] or 0 for r in rows) / len(rows), 1) if rows else 0.0

    return {
        "items": rows,
        "summary": {
            "total_plan":   total_plan,
            "total_actual": total_actual,
            "achievement":  achievement,
            "avg_oee":      avg_oee,
        }
    }


@router.get("/monthly")
async def get_monthly_production(
    year_month: Optional[str] = Query(None),
    months:     int           = Query(6),
    db: AsyncSession = Depends(get_db)
):
    """월간 생산 실적 — year_month 지정 시 해당 월, 없으면 최근 N개월"""
    if year_month:
        sql = text("""
            SELECT
                pm.year_month,
                pl.code AS product_code,
                pl.name AS product_name,
                pm.plan_qty, pm.actual_qty,
                ROUND(
                    CASE WHEN pm.plan_qty > 0
                    THEN pm.actual_qty::NUMERIC / pm.plan_qty * 100
                    ELSE 0 END, 1
                )        AS achievement_pct,
                pm.oee   AS avg_oee,
                0        AS total_downtime_h
            FROM production_monthly pm
            JOIN product_lines pl ON pm.product_line_id = pl.id
            WHERE pm.year_month = :ym
            ORDER BY pl.name
        """)
        result = await db.execute(sql, {"ym": year_month})
    else:
        sql = text("""
            SELECT
                pm.year_month,
                SUM(pm.plan_qty)   AS plan_qty,
                SUM(pm.actual_qty) AS actual_qty,
                ROUND(
                    CASE WHEN SUM(pm.plan_qty) > 0
                    THEN SUM(pm.actual_qty)::NUMERIC / SUM(pm.plan_qty) * 100
                    ELSE 0 END, 1
                )                  AS achievement_pct,
                ROUND(AVG(pm.oee), 1) AS avg_oee,
                0                  AS total_downtime_h,
                NULL               AS line_code
            FROM production_monthly pm
            GROUP BY pm.year_month
            ORDER BY pm.year_month DESC
            LIMIT :lim
        """)
        result = await db.execute(sql, {"lim": months})

    return {"items": [dict(r) for r in result.mappings().all()]}


@router.post("/weekly")
async def upsert_weekly_production(body: dict, db: AsyncSession = Depends(get_db)):
    """주간 생산 실적 입력"""
    plan   = body.get("plan_qty", 0) or 0
    actual = body.get("actual_qty", 0) or 0

    sql = text("""
        INSERT INTO production_weekly (
            year_week, product_line_id, line_code,
            plan_qty, actual_qty, achievement,
            worker_count, overtime_hours, downtime_hours, notes
        ) VALUES (
            :year_week, :product_line_id, :line_code,
            :plan_qty, :actual_qty, :achievement,
            :worker_count, :overtime_hours, :downtime_hours, :notes
        )
        ON CONFLICT (year_week, product_line_id, line_code)
        DO UPDATE SET
            plan_qty       = EXCLUDED.plan_qty,
            actual_qty     = EXCLUDED.actual_qty,
            achievement    = EXCLUDED.achievement,
            worker_count   = EXCLUDED.worker_count,
            overtime_hours = EXCLUDED.overtime_hours,
            downtime_hours = EXCLUDED.downtime_hours,
            notes          = EXCLUDED.notes
        RETURNING id
    """)
    result = await db.execute(sql, {
        "year_week":       body["year_week"],
        "product_line_id": body["product_line_id"],
        "line_code":       body.get("line_code", "-"),
        "plan_qty":        plan,
        "actual_qty":      actual,
        "achievement":     round(actual / plan * 100, 1) if plan > 0 else 0,
        "worker_count":    body.get("worker_count", 0),
        "overtime_hours":  body.get("overtime_hours", 0),
        "downtime_hours":  body.get("downtime_hours", 0),
        "notes":           body.get("notes"),
    })
    await db.commit()
    return {"id": result.scalar()}


@router.get("/oee/trend")
async def get_oee_trend(
    line_code: Optional[str] = Query(None),
    months:    int           = Query(6),
    db: AsyncSession = Depends(get_db)
):
    """OEE 추이"""
    where = "AND pw.line_code = :lc" if line_code else ""
    sql = text(f"""
        SELECT
            pw.year_week,
            pw.line_code,
            ROUND(AVG(pw.downtime_hours), 1)  AS avg_downtime_h,
            ROUND(
                CASE WHEN SUM(pw.plan_qty) > 0
                THEN SUM(pw.actual_qty)::NUMERIC / SUM(pw.plan_qty) * 100
                ELSE 0 END, 1
            ) AS achievement_pct
        FROM production_weekly pw
        WHERE 1=1 {where}
        GROUP BY pw.year_week, pw.line_code
        ORDER BY pw.year_week DESC
        LIMIT :lim
    """)
    params: dict = {"lim": months * 5}
    if line_code:
        params["lc"] = line_code
    result = await db.execute(sql, params)
    return [dict(r) for r in result.mappings().all()]
