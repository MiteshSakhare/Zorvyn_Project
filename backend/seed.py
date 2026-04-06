"""Database Seeding Script for Demo Data — Idempotent"""
import os
import sys
from datetime import datetime, date, timedelta, timezone
from decimal import Decimal
import random

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine, Base
from app.models.user import User, RoleEnum
from app.models.category import Category
from app.models.transaction import Transaction, TransactionTypeEnum
from app.core.security import hash_password

# Create tables
Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    # ── Idempotent check ────────────────────────────────────
    existing_users = db.query(User).count()
    if existing_users > 0:
        print("✓ Database already seeded — skipping.")
        sys.exit(0)

    # ── Create demo users ───────────────────────────────────
    admin_user = User(
        email="admin@finance.com",
        hashed_password=hash_password("Admin@123"),
        full_name="Mitesh Sakhare",
        role=RoleEnum.ADMIN,
        is_active=True,
    )

    analyst_user = User(
        email="analyst@finance.com",
        hashed_password=hash_password("Analyst@123"),
        full_name="Priya Sharma",
        role=RoleEnum.ANALYST,
        is_active=True,
    )

    viewer_user = User(
        email="viewer@finance.com",
        hashed_password=hash_password("Viewer@123"),
        full_name="Rahul Verma",
        role=RoleEnum.VIEWER,
        is_active=True,
    )

    db.add_all([admin_user, analyst_user, viewer_user])
    db.commit()

    print("✓ Created 3 demo users")

    # ── Create categories ───────────────────────────────────
    categories_data = [
        {"name": "Salary", "description": "Monthly salary income"},
        {"name": "Freelance", "description": "Freelance projects and consulting"},
        {"name": "Bonus", "description": "Performance bonuses and incentives"},
        {"name": "Investments", "description": "Returns from investments and dividends"},
        {"name": "Rent", "description": "Rent or mortgage payments"},
        {"name": "Food", "description": "Groceries, dining, and restaurants"},
        {"name": "Utilities", "description": "Electricity, water, internet bills"},
        {"name": "Transportation", "description": "Fuel, public transport, rides"},
        {"name": "Entertainment", "description": "Movies, games, subscriptions"},
        {"name": "Healthcare", "description": "Medical expenses and insurance"},
        {"name": "Shopping", "description": "Clothing and personal items"},
        {"name": "Education", "description": "Courses, books, certifications"},
    ]

    categories = []
    for cat_data in categories_data:
        category = Category(
            name=cat_data["name"],
            description=cat_data["description"],
            created_by=admin_user.id,
        )
        categories.append(category)

    db.add_all(categories)
    db.commit()

    print(f"✓ Created {len(categories)} categories")

    # ── Create sample transactions ──────────────────────────
    category_map = {cat.name: cat.id for cat in categories}

    income_categories = ["Salary", "Freelance", "Bonus", "Investments"]
    expense_categories = [
        "Rent", "Food", "Utilities", "Transportation",
        "Entertainment", "Healthcare", "Shopping", "Education",
    ]

    # Realistic notes templates
    income_notes = {
        "Salary": [
            "Monthly salary - April", "Monthly salary - March",
            "Monthly salary - February", "Monthly salary - January",
            "Monthly salary - December", "Monthly salary - November",
        ],
        "Freelance": [
            "React dashboard for client", "API integration project",
            "Mobile app UI design", "Data analysis report",
            "Website redesign contract", "Consulting session",
        ],
        "Bonus": [
            "Q4 performance bonus", "Annual incentive",
            "Project completion reward", "Referral bonus",
        ],
        "Investments": [
            "Mutual fund dividend", "Stock returns - NIFTY50",
            "Fixed deposit interest", "SIP redemption",
        ],
    }

    expense_notes = {
        "Rent": ["Monthly apartment rent", "Maintenance charges", "Society fees"],
        "Food": [
            "Swiggy order", "Weekly groceries - BigBasket",
            "Team lunch at office", "Dinner with friends",
            "Monthly Zomato subscription", "Sunday brunch",
        ],
        "Utilities": [
            "Electricity bill - Tata Power", "Jio fiber internet",
            "Water supply charges", "Gas bill - Mahanagar",
            "Airtel mobile recharge",
        ],
        "Transportation": [
            "Uber ride to office", "Metro card recharge",
            "Petrol fill-up", "Ola ride to airport",
            "Rapido bike taxi",
        ],
        "Entertainment": [
            "Netflix subscription", "Amazon Prime renewal",
            "Movie tickets - PVR", "Spotify premium",
            "Gaming purchase - Steam",
        ],
        "Healthcare": [
            "Doctor consultation", "Pharmacy - Apollo",
            "Health insurance premium", "Lab test - Thyrocare",
            "Gym membership renewal",
        ],
        "Shopping": [
            "Amazon order - electronics", "Myntra clothing haul",
            "Flipkart Big Billion Days", "Birthday gift purchase",
            "Home décor from IKEA",
        ],
        "Education": [
            "Udemy course - FastAPI", "Book purchase - O'Reilly",
            "AWS certification exam", "Coursera subscription",
        ],
    }

    # Realistic income/expense amount ranges (in INR)
    income_amounts = {
        "Salary": (45000, 85000),
        "Freelance": (8000, 35000),
        "Bonus": (15000, 50000),
        "Investments": (2000, 12000),
    }

    expense_amounts = {
        "Rent": (12000, 25000),
        "Food": (200, 3500),
        "Utilities": (500, 4000),
        "Transportation": (100, 2500),
        "Entertainment": (199, 1500),
        "Healthcare": (500, 8000),
        "Shopping": (800, 12000),
        "Education": (500, 5000),
    }

    users = [admin_user, analyst_user, viewer_user]
    transactions = []
    start_date = date.today() - timedelta(days=180)

    # Generate 60 sample transactions: 20 per user to ensure fair distribution
    for user in users:
        for tx_count in range(20):
            is_income = random.random() < 0.35  # ~35% income, 65% expense

            if is_income:
                category_name = random.choice(income_categories)
                low, high = income_amounts[category_name]
                amount = Decimal(str(random.randint(low, high)))
                note = random.choice(income_notes[category_name])
            else:
                category_name = random.choice(expense_categories)
                low, high = expense_amounts[category_name]
                amount = Decimal(str(random.randint(low, high)))
                note = random.choice(expense_notes[category_name])

            transaction_date = start_date + timedelta(days=random.randint(0, 180))

            transaction = Transaction(
                user_id=user.id,
                amount=amount,
                type=TransactionTypeEnum.INCOME if is_income else TransactionTypeEnum.EXPENSE,
                category_id=category_map[category_name],
                date=transaction_date,
                notes=note,
                is_deleted=False,
            )
            transactions.append(transaction)

    db.add_all(transactions)
    db.commit()

    print(f"✓ Created {len(transactions)} sample transactions")

    print("\n✅ Database seeded successfully!")
    print("\nDemo Accounts:")
    print("  Admin:   admin@finance.com / Admin@123")
    print("  Analyst: analyst@finance.com / Analyst@123")
    print("  Viewer:  viewer@finance.com / Viewer@123")

finally:
    db.close()
