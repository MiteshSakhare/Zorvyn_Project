"""Conftest for pytest"""
import os
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.config import Settings


@pytest.fixture(scope="session")
def test_db():
    """Create test database."""
    # Use SQLite for testing
    SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
    
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )
    
    Base.metadata.create_all(bind=engine)
    
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    yield TestingSessionLocal()
    
    # Cleanup
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def app_settings():
    """Get test settings."""
    return Settings(
        DATABASE_URL="sqlite:///./test.db",
        DEBUG=True,
        SECRET_KEY="test-secret-key",
    )
