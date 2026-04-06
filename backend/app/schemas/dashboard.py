"""Dashboard Pydantic Schemas"""
from pydantic import BaseModel, ConfigDict, field_serializer
from typing import Optional, List
from uuid import UUID
from decimal import Decimal
from datetime import date


class DashboardSummary(BaseModel):
    """Dashboard summary statistics."""
    total_income: Decimal
    total_expenses: Decimal
    net_balance: Decimal
    transaction_count: int
    
    model_config = ConfigDict(json_encoders={Decimal: float})
    
    @field_serializer('total_income', 'total_expenses', 'net_balance')
    def serialize_decimal(self, value: Decimal) -> float:
        """Serialize Decimal to float for JSON."""
        return float(value) if value is not None else 0.0


class CategoryTotal(BaseModel):
    """Category-wise total."""
    category_id: UUID
    category_name: str
    income: Decimal = Decimal(0)
    expenses: Decimal = Decimal(0)
    total: Decimal = Decimal(0)
    
    model_config = ConfigDict(json_encoders={Decimal: float})
    
    @field_serializer('income', 'expenses', 'total')
    def serialize_decimal(self, value: Decimal) -> float:
        """Serialize Decimal to float for JSON."""
        return float(value) if value is not None else 0.0


class CategoryBreakdownResponse(BaseModel):
    """Category-wise breakdown."""
    categories: List[CategoryTotal]
    total_income: Decimal
    total_expenses: Decimal
    
    model_config = ConfigDict(json_encoders={Decimal: float})
    
    @field_serializer('total_income', 'total_expenses')
    def serialize_decimal(self, value: Decimal) -> float:
        """Serialize Decimal to float for JSON."""
        return float(value) if value is not None else 0.0


class MonthlyTrend(BaseModel):
    """Monthly trend data."""
    month: str  # Format: "2024-01"
    income: Decimal
    expenses: Decimal
    net: Decimal
    
    model_config = ConfigDict(json_encoders={Decimal: float})
    
    @field_serializer('income', 'expenses', 'net')
    def serialize_decimal(self, value: Decimal) -> float:
        """Serialize Decimal to float for JSON."""
        return float(value) if value is not None else 0.0


class DashboardTrendsResponse(BaseModel):
    """Dashboard trends response."""
    trends: List[MonthlyTrend]


class RecentTransaction(BaseModel):
    """Recent transaction item."""
    id: UUID
    amount: Decimal
    type: str
    category_name: str
    date: date
    notes: Optional[str]
    
    model_config = ConfigDict(json_encoders={Decimal: float})
    
    @field_serializer('amount')
    def serialize_decimal(self, value: Decimal) -> float:
        """Serialize Decimal to float for JSON."""
        return float(value) if value is not None else 0.0


class RecentTransactionsResponse(BaseModel):
    """Recent transactions response."""
    transactions: List[RecentTransaction]
