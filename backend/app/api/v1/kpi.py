from fastapi import APIRouter, Depends, Query
from typing import Optional
from app.services.snowflake.client import get_snowflake_client

router = APIRouter()


@router.get("/{department}")
async def get_department_kpi(
    department: str,
    period: str = Query("current_week", description="current_week | current_month | ytd"),
):
    client = get_snowflake_client()
    mart_map = {
        "management":  "MART.mart_exec_kpi_weekly",
        "procurement": "MART.mart_procurement_risk_daily",
        "production":  "MART.mart_production_oee_daily",
        "quality":     "MART.mart_quality_ppm_weekly",
        "sales":       "MART.mart_sales_pipeline_weekly",
    }
    view = mart_map.get(department, "MART.mart_exec_kpi_weekly")
    try:
        rows = await client.execute(
            f"SELECT * FROM FACT_DB.{view} WHERE dept_code = %(dept)s ORDER BY snapshot_at DESC LIMIT 50",
            {"dept": department},
        )
    except Exception:
        rows = []
    return {"department": department, "period": period, "items": rows}


@router.get("/{department}/trend")
async def get_kpi_trend(
    department: str,
    kpi: str = Query(...),
    weeks: int = Query(12, ge=1, le=52),
):
    """특정 KPI의 주별 추이 데이터"""
    client = get_snowflake_client()
    try:
        rows = await client.execute(
            """
            SELECT week_label, kpi_value, kpi_unit
            FROM FACT_DB.MART.mart_exec_kpi_weekly
            WHERE dept_code = %(dept)s
              AND kpi_name   = %(kpi)s
            ORDER BY week_label DESC
            LIMIT %(weeks)s
            """,
            {"dept": department, "kpi": kpi, "weeks": weeks},
        )
    except Exception:
        rows = []
    return {"kpi": kpi, "department": department, "data": list(reversed(rows))}
