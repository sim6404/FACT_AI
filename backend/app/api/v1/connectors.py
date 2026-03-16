from fastapi import APIRouter, BackgroundTasks
from app.services.snowflake.client import get_snowflake_client

router = APIRouter()

CONNECTOR_NAMES = ["erp", "mes", "plm", "excel_budget", "quality_docs"]


@router.post("/{name}/sync")
async def trigger_sync(name: str, background_tasks: BackgroundTasks):
    if name not in CONNECTOR_NAMES:
        from fastapi import HTTPException
        raise HTTPException(400, f"Unknown connector: {name}")
    # TODO: enqueue Celery task for connector sync
    return {"connector": name, "status": "queued"}


@router.get("/runs")
async def connector_runs(limit: int = 50):
    client = get_snowflake_client()
    try:
        rows = await client.execute("""
            SELECT connector_name, started_at, ended_at, status,
                   inserted_rows, updated_rows, error_message
            FROM FACT_DB.RAW.connector_run_log
            ORDER BY started_at DESC
            LIMIT %(lim)s
        """, {"lim": limit})
    except Exception:
        rows = []
    return {"items": rows}


@router.get("/health")
async def connectors_health():
    """각 커넥터 상태 체크"""
    return {
        "connectors": [
            {"name": n, "status": "unknown"} for n in CONNECTOR_NAMES
        ]
    }
