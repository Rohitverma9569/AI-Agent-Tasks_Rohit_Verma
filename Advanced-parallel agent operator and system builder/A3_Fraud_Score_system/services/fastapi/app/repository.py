from __future__ import annotations

import json
import uuid
from typing import Any

from app.database import get_connection, row_to_transaction, utc_now


def create_transaction(
    user_id: str,
    merchant_id: str,
    amount: float,
    currency: str,
    db_path=None,
) -> dict[str, Any]:
    transaction_id = str(uuid.uuid4())
    now = utc_now()
    processing_payload = {
        "transaction_id": transaction_id,
        "user_id": user_id,
        "merchant_id": merchant_id,
        "amount": amount,
        "currency": currency,
    }

    with get_connection(db_path) as conn:
        conn.execute(
            """
            INSERT INTO transactions (
                id, user_id, merchant_id, amount, currency,
                status, risk_score, score_value, reasons, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, 'PENDING', NULL, NULL, NULL, ?, ?)
            """,
            (transaction_id, user_id, merchant_id, amount, currency, now, now),
        )
        conn.execute(
            """
            INSERT INTO processing_queue (transaction_id, payload, status, created_at)
            VALUES (?, ?, 'PENDING', ?)
            """,
            (transaction_id, json.dumps(processing_payload), now),
        )
        row = conn.execute(
            "SELECT * FROM transactions WHERE id = ?", (transaction_id,)
        ).fetchone()

    return row_to_transaction(row)


def get_transaction(transaction_id: str, db_path=None) -> Optional[dict[str, Any]]:
    with get_connection(db_path) as conn:
        row = conn.execute(
            "SELECT * FROM transactions WHERE id = ?", (transaction_id,)
        ).fetchone()
    return row_to_transaction(row) if row else None
