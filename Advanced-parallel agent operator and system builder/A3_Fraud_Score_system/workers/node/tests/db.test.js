import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";

import { claimNextJob, completeJob, openDatabase } from "../src/db.js";

test("claimNextJob returns pending processing payload", () => {
  const dbPath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "fraud-")), "test.db");
  const db = openDatabase(dbPath);
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO processing_queue (transaction_id, payload, status, created_at)
     VALUES (?, ?, 'PENDING', ?)`,
  ).run("tx-abc", JSON.stringify({ transaction_id: "tx-abc", amount: 10 }), now);

  const job = claimNextJob(db);
  assert.ok(job);
  assert.equal(job.transactionId, "tx-abc");
  db.close();
});

test("completeJob stores risk score on transaction", () => {
  const dbPath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "fraud-")), "test.db");
  const db = openDatabase(dbPath);
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO transactions (
      id, user_id, merchant_id, amount, currency, status, created_at, updated_at
    ) VALUES (?, 'u1', 'm1', 10, 'USD', 'PENDING', ?, ?)`,
  ).run("tx-abc", now, now);
  db.prepare(
    `INSERT INTO processing_queue (transaction_id, payload, status, created_at)
     VALUES ('tx-abc', '{}', 'PROCESSING', ?)`,
  ).run(now);

  completeJob(db, 1, "tx-abc", {
    risk_score: "LOW",
    score_value: 0.2,
    reasons: ["amount_within_normal_range"],
  });

  const row = db
    .prepare("SELECT status, risk_score FROM transactions WHERE id = ?")
    .get("tx-abc");
  assert.equal(row.status, "COMPLETED");
  assert.equal(row.risk_score, "LOW");
  db.close();
});
