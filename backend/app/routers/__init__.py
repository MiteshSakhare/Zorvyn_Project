"""Routers package"""
from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.routers.transactions import router as transactions_router
from app.routers.categories import router as categories_router
from app.routers.dashboard import router as dashboard_router
from app.routers.audit import router as audit_router

__all__ = ["auth_router", "users_router", "transactions_router", "categories_router", "dashboard_router", "audit_router"]
