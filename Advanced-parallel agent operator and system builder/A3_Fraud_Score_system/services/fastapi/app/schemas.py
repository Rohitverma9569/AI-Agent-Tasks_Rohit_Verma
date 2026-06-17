from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field, field_validator


class TransactionCreate(BaseModel):
    user_id: str = Field(min_length=1)
    merchant_id: str = Field(min_length=1)
    amount: float = Field(gt=0)
    currency: str = Field(min_length=3, max_length=3)

    @field_validator("currency")
    @classmethod
    def currency_uppercase(cls, value: str) -> str:
        normalized = value.upper()
        if not normalized.isalpha():
            raise ValueError("currency must be alphabetic ISO code")
        return normalized


class TransactionResponse(BaseModel):
    id: str
    user_id: str
    merchant_id: str
    amount: float
    currency: str
    status: str
    risk_score: Optional[str] = None
    score_value: Optional[float] = None
    reasons: Optional[list[str]] = None
    created_at: str
    updated_at: str
