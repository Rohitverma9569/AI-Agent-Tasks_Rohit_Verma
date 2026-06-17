from __future__ import annotations

import json
import os
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterator, Optional

from app.config import DEFAULT_DB_PATH

SCHEMA = """
CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    merchant_id TEXT NOT NULL,
    amount REAL NOT NULL,
    currency TEXT NOT NULL,
    status TEXT NOT NULL,
    risk_score TEXT,
    score_value REAL,
    reasons TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS processing_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_id TEXT NOT NULL UNIQUE,
    payload TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    created_at TEXT NOT NULL,
    processed_at TEXT
);
"""


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def get_db_path() -> Path:
    override = os.environ.get("FRAUD_DB_PATH")
    return Path(override) if override else DEFAULT_DB_PATH


def init_db(db_path: Optional[Path] = None) -> None:
    path = db_path or get_db_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(path) as conn:
        conn.executescript(SCHEMA)
        conn.commit()


@contextmanager
def get_connection(db_path: Optional[Path] = None) -> Iterator[sqlite3.Connection]:
    path = db_path or get_db_path()
    init_db(path)
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def row_to_transaction(row: sqlite3.Row) -> dict[str, Any]:
    reasons = json.loads(row["reasons"]) if row["reasons"] else None
    return {
        "id": row["id"],
        "user_id": row["user_id"],
        "merchant_id": row["merchant_id"],
        "amount": row["amount"],
        "currency": row["currency"],
        "status": row["status"],
        "risk_score": row["risk_score"],
        "score_value": row["score_value"],
        "reasons": reasons,
        "created_at": row["created_at"],
        "updated_at": row["updated_at"],
    }
