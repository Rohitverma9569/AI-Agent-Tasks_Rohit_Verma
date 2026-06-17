from uuid import uuid4

from app.models import Transaction, TransactionCreate


class TransactionStore:
    """Thread-safe enough for demo; in-memory list backing store."""

    def __init__(self) -> None:
        self._transactions: list[Transaction] = []

    def create(self, payload: TransactionCreate) -> Transaction:
        transaction = Transaction(
            id=str(uuid4()),
            amount=payload.amount,
            type=payload.type,
            timestamp=payload.timestamp,
        )
        self._transactions.append(transaction)
        return transaction

    def list_all(self) -> list[Transaction]:
        return list(self._transactions)

    def balance(self) -> tuple[float, int]:
        total = 0.0
        for txn in self._transactions:
            if txn.type == "credit":
                total += txn.amount
            else:
                total -= txn.amount
        return total, len(self._transactions)

    def clear(self) -> None:
        """Reset store — used by tests."""
        self._transactions.clear()


store = TransactionStore()
