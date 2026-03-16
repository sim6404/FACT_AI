from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
import structlog

from app.core.database import get_db
from app.schemas.agent import AgentQueryRequest, AgentResponse, AgentFeedbackRequest
from app.services.agent.orchestrator import run_agent

router = APIRouter()
log    = structlog.get_logger(__name__)


@router.post("/query", response_model=AgentResponse)
async def agent_query(
    req: AgentQueryRequest,
    # current_user: dict = Depends(get_current_user),   # uncomment when auth ready
    db: AsyncSession = Depends(get_db),
):
    """
    자연어 질의 → Router Agent → Specialist → 응답
    """
    try:
        response = await run_agent(
            question=req.question,
            user_id=1,              # TODO: current_user["id"]
            department_hint=req.department,
        )
        # TODO: persist agent_run to DB
        return response
    except Exception as e:
        log.error("Agent query failed", error=str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/runs")
async def list_runs(
    limit: int = 20,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
):
    """에이전트 실행 이력"""
    # TODO: query agent_runs from DB
    return {"items": [], "total": 0}


@router.get("/runs/{run_id}")
async def get_run(run_id: str, db: AsyncSession = Depends(get_db)):
    """특정 실행 결과 조회"""
    # TODO: fetch from DB
    raise HTTPException(status_code=404, detail="Run not found")


@router.post("/feedback")
async def submit_feedback(req: AgentFeedbackRequest, db: AsyncSession = Depends(get_db)):
    """답변 품질 피드백"""
    # TODO: persist feedback
    return {"status": "ok"}
