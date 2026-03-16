from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db

router = APIRouter()


class ApprovalDecision(BaseModel):
    comment: Optional[str] = None


@router.get("")
async def list_approvals(
    status: Optional[str] = None,   # pending | approved | rejected
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
):
    # TODO: query approvals table
    return {"items": [], "total": 0}


@router.post("/{approval_id}/approve")
async def approve(
    approval_id: int,
    body: ApprovalDecision,
    db: AsyncSession = Depends(get_db),
):
    # TODO: update approval status, trigger action executor
    return {"status": "approved", "approval_id": approval_id}


@router.post("/{approval_id}/reject")
async def reject(
    approval_id: int,
    body: ApprovalDecision,
    db: AsyncSession = Depends(get_db),
):
    # TODO: update approval status
    return {"status": "rejected", "approval_id": approval_id}
