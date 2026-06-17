import logging

from fastapi import APIRouter, status

from app.models import BalanceResponse, Transaction, TransactionCreate
from app.storage import store

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.post(
    "",
    response_model=Transaction,
    status_code=status.HTTP_201_CREATED,
    summary="Create a transaction",
)
def create_transaction(payload: TransactionCreate) -> Transaction:
    transaction = store.create(payload)
    logger.info(
        "Created transaction id=%s type=%s amount=%s",
        transaction.id,
        transaction.type,
        transaction.amount,
    )
    return transaction


@router.get(
    "",
    response_model=list[Transaction],
    summary="List all transactions",
)
def get_transactions() -> list[Transaction]:
    transactions = store.list_all()
    logger.info("Listed %d transaction(s)", len(transactions))
    return transactions


balance_router = APIRouter(tags=["balance"])


@balance_router.get(
    "/balance",
    response_model=BalanceResponse,
    summary="Get current balance",
)
def get_balance() -> BalanceResponse:
    balance, count = store.balance()
    logger.info("Balance requested: balance=%s count=%d", balance, count)
    return BalanceResponse(balance=balance, transaction_count=count)
