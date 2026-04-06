"""FastAPI Application Entry Point"""
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from app.config import get_settings
from app.database import engine, Base, get_db
from app.routers import (
    auth_router, users_router, transactions_router, 
    categories_router, dashboard_router, audit_router
)
from fastapi.responses import JSONResponse
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Finance Data Processing & Access Control API",
)

from app.core.rate_limit import limiter, _rate_limit_exceeded_handler, RateLimitExceeded

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Global error caught: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred. Please contact support."}
    )

# Rate Limit Error Handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS Configuration
origins = [origin.strip() for origin in settings.ALLOWED_ORIGINS.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(transactions_router)
app.include_router(categories_router)
app.include_router(dashboard_router)
app.include_router(audit_router)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "app": settings.APP_NAME}


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Welcome to Zorvyn Finance API",
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "openapi": "/openapi.json"
    }


# Custom OpenAPI schema with Bearer token security
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )
    
    openapi_schema["components"]["securitySchemes"] = {
        "Bearer": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }
    
    openapi_schema["security"] = [{"Bearer": []}]
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
    )
