import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const SCHEMA = `
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
`;

export function openDatabase(dbPath) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = new DatabaseSync(dbPath);
  db.exec(SCHEMA);
  return db;
}

export function claimNextJob(db) {
  const job = db
    .prepare(
      `SELECT id, transaction_id, payload
       FROM processing_queue
       WHERE status = 'PENDING'
       ORDER BY id ASC
       LIMIT 1`,
    )
    .get();

  if (!job) {
    return null;
  }

  db.prepare(`UPDATE processing_queue SET status = 'PROCESSING' WHERE id = ?`).run(
    job.id,
  );

  return {
    queueId: job.id,
    transactionId: job.transaction_id,
    payload: JSON.parse(job.payload),
  };
}

export function completeJob(db, queueId, transactionId, score) {
  const now = new Date().toISOString();
  db.exec("BEGIN");
  try {
    db.prepare(
      `UPDATE transactions
       SET status = 'COMPLETED',
           risk_score = ?,
           score_value = ?,
           reasons = ?,
           updated_at = ?
       WHERE id = ?`,
    ).run(score.risk_score, score.score_value, JSON.stringify(score.reasons), now, transactionId);
    db.prepare(
      `UPDATE processing_queue SET status = 'COMPLETED', processed_at = ? WHERE id = ?`,
    ).run(now, queueId);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function failJob(db, queueId, transactionId, errorMessage) {
  const now = new Date().toISOString();
  db.exec("BEGIN");
  try {
    db.prepare(`UPDATE transactions SET status = 'FAILED', updated_at = ? WHERE id = ?`).run(
      now,
      transactionId,
    );
    db.prepare(
      `UPDATE processing_queue SET status = 'FAILED', processed_at = ? WHERE id = ?`,
    ).run(now, queueId);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
  console.error(`Failed job ${transactionId}: ${errorMessage}`);
}
