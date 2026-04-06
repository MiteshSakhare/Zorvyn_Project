"""Error Handler Middleware"""
from fastapi import Request, status
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError
import logging

logger = logging.getLogger(__name__)


async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler for all unhandled errors."""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error"}
    )


async def integrity_error_handler(request: Request, exc: IntegrityError):
    """Handle database integrity errors."""
    logger.error(f"Database integrity error: {str(exc)}")
    
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": "Data validation error"}
    )
