"""
Cortex Analyst 래퍼 — 자연어 → 정형 데이터 분석
"""

from typing import Optional
import structlog

from app.services.snowflake.client import get_snowflake_client

log = structlog.get_logger(__name__)


async def query_structured(
    question: str,
    department: Optional[str] = None,
    semantic_model_override: Optional[str] = None,
) -> dict:
    """
    Cortex Analyst로 정형 데이터 질의.
    부서별로 다른 semantic model 파일 사용 가능.
    """
    client = get_snowflake_client()

    # 부서별 semantic model 선택
    dept_semantic = {
        "procurement": "@FACT_DB.PUBLIC.SEMANTIC_MODELS/procurement.yaml",
        "production":  "@FACT_DB.PUBLIC.SEMANTIC_MODELS/production.yaml",
        "quality":     "@FACT_DB.PUBLIC.SEMANTIC_MODELS/quality.yaml",
        "management":  "@FACT_DB.PUBLIC.SEMANTIC_MODELS/management.yaml",
        "sales":       "@FACT_DB.PUBLIC.SEMANTIC_MODELS/sales.yaml",
    }
    semantic_file = (
        semantic_model_override
        or dept_semantic.get(department or "", "")
        or "@FACT_DB.PUBLIC.SEMANTIC_MODELS/fact_semantic.yaml"
    )

    log.info("Cortex Analyst query", question=question[:80], dept=department, semantic=semantic_file)

    result = await client.cortex_analyst_query(
        question=question,
        semantic_model_file=semantic_file,
    )

    log.info(
        "Cortex Analyst result",
        has_sql=bool(result.get("sql")),
        row_count=len(result.get("rows", [])),
    )
    return result


async def get_kpi_value(kpi_name: str, department: str, period: str = "current_week") -> dict:
    """표준 KPI 뷰에서 값을 가져오는 헬퍼."""
    client = get_snowflake_client()

    kpi_view_map = {
        "budget_execution_rate": "MART.mart_exec_kpi_weekly",
        "oee":                   "MART.mart_production_oee_daily",
        "ppm":                   "MART.mart_quality_ppm_weekly",
        "delivery_rate":         "MART.mart_procurement_risk_daily",
    }

    view = kpi_view_map.get(kpi_name)
    if not view:
        return {"error": f"Unknown KPI: {kpi_name}"}

    sql = f"""
    SELECT *
    FROM FACT_DB.{view}
    WHERE dept_code = %(dept)s
      AND period_label = %(period)s
    ORDER BY snapshot_at DESC
    LIMIT 1
    """
    return await client.execute_one(sql, {"dept": department, "period": period}) or {}
