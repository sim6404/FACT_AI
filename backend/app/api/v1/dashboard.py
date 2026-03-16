from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.snowflake.client import get_snowflake_client

router = APIRouter()


@router.get("/summary")
async def dashboard_summary(db: AsyncSession = Depends(get_db)):
    """메인 대시보드 요약 — KPI 카드 + 알림 + 승인 대기 수"""
    client = get_snowflake_client()

    # 실제 환경에서는 mart 뷰에서 가져옴
    try:
        kpi_rows = await client.execute("""
            SELECT
                kpi_name,
                kpi_value,
                kpi_unit,
                trend_pct,
                status,
                dept_code
            FROM FACT_DB.MART.mart_exec_kpi_weekly
            WHERE week_label = TO_CHAR(DATE_TRUNC('week', CURRENT_DATE), 'IYYY-IW')
            ORDER BY dept_code, kpi_name
        """)
    except Exception:
        kpi_rows = []

    return {
        "kpis":             kpi_rows,
        "pending_approvals": 3,
        "active_alerts":     5,
        "critical_alerts":   2,
    }


@router.get("/alerts")
async def get_alerts(severity: str = None, limit: int = 50):
    """알림 목록"""
    client = get_snowflake_client()
    where  = f"AND severity = %(sev)s" if severity else ""
    try:
        rows = await client.execute(
            f"""
            SELECT id, alert_type, severity, dept_code, title, message, source_ref, created_at
            FROM FACT_DB.CORE.v_active_alerts
            WHERE 1=1 {where}
            ORDER BY created_at DESC
            LIMIT %(limit)s
            """,
            {"sev": severity, "limit": limit},
        )
    except Exception:
        rows = []
    return {"items": rows}
