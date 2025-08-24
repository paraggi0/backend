from fastapi import APIRouter
from .endpoints import production, quality_control, warehouse, user_management, historical_stock, master_product

api_router = APIRouter()
api_router.include_router(production.router, prefix="/production", tags=["Production"])
api_router.include_router(quality_control.router, prefix="/quality-control", tags=["Quality Control"])
api_router.include_router(warehouse.router, prefix="/warehouse", tags=["Warehouse"])
api_router.include_router(user_management.router, prefix="/users", tags=["User Management"])
api_router.include_router(historical_stock.router, prefix="/historical-stock", tags=["Historical Stock"])
api_router.include_router(master_product.router, prefix="/master-product", tags=["Master Product"])
