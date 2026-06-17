import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";

import { openDatabase } from "../src/db.js";
import { processNextJob } from "../src/processor.js";

test("processNextJob invokes rust client and completes transaction", async () => {
  const dbPath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "fraud-")), "test.db");
  const db = openDatabase(dbPath);
  const now = new Date().toISOString();
  const payload = {
    transaction_id: "tx-xyz",
    user_id: "u1",
    merchant_id: "M1",
    amount: 50,
    currency: "USD",
  };

  db.prepare(
    `INSERT INTO transactions (
      id, user_id, merchant_id, amount, currency, status, created_at, updated_at
    ) VALUES (?, 'u1', 'M1', 50, 'USD', 'PENDING', ?, ?)`,
  ).run("tx-xyz", now, now);
  db.prepare(
    `INSERT INTO processing_queue (transaction_id, payload, status, created_at)
     VALUES (?, ?, 'PENDING', ?)`,
  ).run("tx-xyz", JSON.stringify(payload), now);

  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({
    ok: true,
    async json() {
      return {
        transaction_id: "tx-xyz",
        risk_score: "LOW",
        score_value: 0.15,
        reasons: ["amount_within_normal_range"],
      };
    },
  });

  try {
    const processed = await processNextJob(db, "http://engine");
    assert.equal(processed, true);
    const row = db
      .prepare("SELECT status, risk_score FROM transactions WHERE id = ?")
      .get("tx-xyz");
    assert.equal(row.status, "COMPLETED");
    assert.equal(row.risk_score, "LOW");
  } finally {
    globalThis.fetch = originalFetch;
    db.close();
  }
});
