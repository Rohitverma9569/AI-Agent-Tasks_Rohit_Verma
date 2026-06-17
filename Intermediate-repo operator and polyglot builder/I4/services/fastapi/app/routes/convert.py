from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException, status

from app.models import ConvertRequest, ConvertResponse, ErrorResponse
from app.services.exchange import UnsupportedCurrencyError, convert_amount, list_supported_currencies

logger = logging.getLogger(__name__)

router = APIRouter(tags=["convert"])


@router.post(
    "/convert",
    response_model=ConvertResponse,
    responses={
        status.HTTP_400_BAD_REQUEST: {"model": ErrorResponse},
        status.HTTP_422_UNPROCESSABLE_ENTITY: {"model": ErrorResponse},
    },
    summary="Convert currency amount",
    description="Convert an amount between supported currencies using hardcoded exchange rates.",
)
def convert_currency(body: ConvertRequest) -> ConvertResponse:
    try:
        converted = convert_amount(body.amount, body.from_currency, body.to_currency)
    except UnsupportedCurrencyError as exc:
        logger.warning("Unsupported currency: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "message": str(exc),
                "supportedCurrencies": list_supported_currencies(),
            },
        ) from exc

    logger.info(
        "Converted %.4f %s -> %.4f %s",
        body.amount,
        body.from_currency,
        converted,
        body.to_currency,
    )
    return ConvertResponse(convertedAmount=converted)
