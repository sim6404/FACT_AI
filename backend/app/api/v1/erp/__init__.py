from fastapi import APIRouter
from .purchase import router as purchase_router
from .quality import router as quality_router
from .production import router as production_router
from .sales import router as sales_router
from .orders import router as orders_router
from .inventory import router as inventory_router

erp_router = APIRouter(prefix="/erp")
erp_router.include_router(purchase_router)
erp_router.include_router(quality_router)
erp_router.include_router(production_router)
erp_router.include_router(sales_router)
erp_router.include_router(orders_router)
erp_router.include_router(inventory_router)
