from __future__ import annotations

import re
from typing import Optional

from pydantic import BaseModel, Field, field_validator

CURRENCY_PATTERN = re.compile(r"^[A-Z]{3}$")


class ConvertRequest(BaseModel):
    amount: float = Field(..., gt=0, description="Positive amount to convert")
    from_currency: str = Field(..., alias="from", description="Source currency code (ISO 4217)")
    to_currency: str = Field(..., alias="to", description="Target currency code (ISO 4217)")

    model_config = {"populate_by_name": True}

    @field_validator("from_currency", "to_currency")
    @classmethod
    def normalize_currency(cls, value: str) -> str:
        normalized = value.strip().upper()
        if not CURRENCY_PATTERN.match(normalized):
            raise ValueError("Currency must be a 3-letter ISO code (e.g. USD, INR)")
        return normalized


class ConvertResponse(BaseModel):
    convertedAmount: float = Field(..., description="Converted amount in target currency")


class ErrorResponse(BaseModel):
    message: str
    detail: Optional[str] = None
