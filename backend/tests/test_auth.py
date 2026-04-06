"""Tests for Authentication"""
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models.user import User, RoleEnum
from app.core.security import hash_password

client = TestClient(app)
db = SessionLocal()


@pytest.fixture(autouse=True)
def cleanup():
    """Clean up after each test."""
    yield
    db.query(User).delete()
    db.commit()


def test_register_user():
    """Test user registration."""
    response = client.post(
        "/auth/register",
        json={
            "email": "newuser@example.com",
            "password": "SecurePass123",
            "full_name": "New User",
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "newuser@example.com"
    assert data["user"]["role"] == "viewer"


def test_register_duplicate_email():
    """Test registration with duplicate email."""
    user = User(
        email="existing@example.com",
        hashed_password=hash_password("Password123"),
        full_name="Existing User",
        role=RoleEnum.VIEWER,
        is_active=True,
    )
    db.add(user)
    db.commit()
    
    response = client.post(
        "/auth/register",
        json={
            "email": "existing@example.com",
            "password": "SecurePass123",
            "full_name": "Another User",
        }
    )
    assert response.status_code == 400


def test_login_success():
    """Test successful login."""
    user = User(
        email="login@example.com",
        hashed_password=hash_password("Password123"),
        full_name="Login User",
        role=RoleEnum.VIEWER,
        is_active=True,
    )
    db.add(user)
    db.commit()
    
    response = client.post(
        "/auth/login",
        json={
            "email": "login@example.com",
            "password": "Password123",
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "login@example.com"


def test_login_invalid_password():
    """Test login with invalid password."""
    user = User(
        email="login@example.com",
        hashed_password=hash_password("CorrectPassword"),
        full_name="Login User",
        role=RoleEnum.VIEWER,
        is_active=True,
    )
    db.add(user)
    db.commit()
    
    response = client.post(
        "/auth/login",
        json={
            "email": "login@example.com",
            "password": "WrongPassword",
        }
    )
    assert response.status_code == 401
