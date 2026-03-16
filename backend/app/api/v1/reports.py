from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional
from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db

router = APIRouter()


class ReportGenerateRequest(BaseModel):
    report_type: str               # weekly_ops | monthly_mgmt | custom
    department_code: str
    period_start: date
    period_end:   date
    format: str = "pdf"            # pdf | pptx
    title: Optional[str] = None


@router.post("/generate")
async def generate_report(
    req: ReportGenerateRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    """보고서 생성 요청 — 백그라운드 작업으로 처리"""
    # TODO: create report record in DB, enqueue Celery task
    job_id = "mock-job-001"
    background_tasks.add_task(_generate_report_task, req, job_id)
    return {"job_id": job_id, "status": "queued", "message": "보고서 생성이 시작되었습니다."}


async def _generate_report_task(req: ReportGenerateRequest, job_id: str):
    """Celery로 넘길 실제 생성 로직 (임시 인라인)"""
    from app.services.report.composer import compose_report
    await compose_report(req.dict(), job_id)


@router.get("")
async def list_reports(
    department: Optional[str] = None,
    limit: int = 20,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
):
    # TODO: query reports table
    return {"items": [], "total": 0}


@router.get("/{report_id}")
async def get_report(report_id: str, db: AsyncSession = Depends(get_db)):
    # TODO: fetch from DB
    raise HTTPException(404, "Report not found")


@router.post("/{report_id}/publish")
async def publish_report(report_id: str, db: AsyncSession = Depends(get_db)):
    """배포 승인 후 알림 발송"""
    # TODO: update status, send notification
    return {"status": "published"}
