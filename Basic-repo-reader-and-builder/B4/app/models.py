from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum
from typing import Literal, Optional

from pydantic import BaseModel, Field, model_validator


class TransactionType(str, Enum):
    CREDIT = "credit"
    DEBIT = "debit"


class TransactionCreate(BaseModel):
    amount: float = Field(..., gt=0, description="Transaction amount (must be positive)")
    type: Literal["credit", "debit"]
    timestamp: Optional[datetime] = Field(
        default=None,
        description="Transaction timestamp; defaults to UTC now if omitted",
    )

    @model_validator(mode="after")
    def set_timestamp(self) -> "TransactionCreate":
        if self.timestamp is None:
            self.timestamp = datetime.now(timezone.utc)
        elif self.timestamp.tzinfo is None:
            self.timestamp = self.timestamp.replace(tzinfo=timezone.utc)
        return self


class Transaction(BaseModel):
    id: str
    amount: float = Field(..., gt=0)
    type: Literal["credit", "debit"]
    timestamp: datetime

    model_config = {"json_schema_extra": {"example": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "amount": 100.50,
        "type": "credit",
        "timestamp": "2026-06-17T12:00:00Z",
    }}}


class BalanceResponse(BaseModel):
    balance: float
    transaction_count: int
