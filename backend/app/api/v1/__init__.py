from fastapi import APIRouter
from app.api.v1 import agent, dashboard, reports, approvals, documents, kpi, connectors, auth
from app.api.v1.erp import erp_router

router = APIRouter()

router.include_router(auth.router,        prefix="/auth",       tags=["Auth"])
router.include_router(agent.router,       prefix="/agent",      tags=["Agent"])
router.include_router(dashboard.router,   prefix="/dashboard",  tags=["Dashboard"])
router.include_router(kpi.router,         prefix="/kpi",        tags=["KPI"])
router.include_router(reports.router,     prefix="/reports",    tags=["Reports"])
router.include_router(approvals.router,   prefix="/approvals",  tags=["Approvals"])
router.include_router(documents.router,   prefix="/documents",  tags=["Documents"])
router.include_router(connectors.router,  prefix="/connectors", tags=["Connectors"])
router.include_router(erp_router,                               tags=["ERP"])
