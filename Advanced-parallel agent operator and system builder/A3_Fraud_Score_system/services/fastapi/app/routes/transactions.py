from fastapi import APIRouter, HTTPException, status

from app.repository import create_transaction, get_transaction
from app.schemas import TransactionCreate, TransactionResponse

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.post("", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
def post_transaction(payload: TransactionCreate) -> TransactionResponse:
    record = create_transaction(
        user_id=payload.user_id,
        merchant_id=payload.merchant_id,
        amount=payload.amount,
        currency=payload.currency,
    )
    return TransactionResponse(**record)


@router.get("/{transaction_id}", response_model=TransactionResponse)
def fetch_transaction(transaction_id: str) -> TransactionResponse:
    record = get_transaction(transaction_id)
    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Transaction {transaction_id} not found",
        )
    return TransactionResponse(**record)
