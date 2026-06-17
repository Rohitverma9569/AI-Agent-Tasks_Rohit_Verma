import assert from "node:assert/strict";
import { test } from "node:test";

import { scoreTransaction } from "../src/scorer.js";

test("scoreTransaction maps LOW/MEDIUM/HIGH from amount rules", () => {
  const low = scoreTransaction({
    transaction_id: "tx-1",
    user_id: "u1",
    merchant_id: "MERCH",
    amount: 50,
    currency: "USD",
  });
  assert.equal(low.risk_score, "LOW");

  const medium = scoreTransaction({
    transaction_id: "tx-2",
    user_id: "u1",
    merchant_id: "MERCH",
    amount: 2500,
    currency: "USD",
  });
  assert.equal(medium.risk_score, "MEDIUM");

  const high = scoreTransaction({
    transaction_id: "tx-3",
    user_id: "u1",
    merchant_id: "MERCH",
    amount: 12000,
    currency: "USD",
  });
  assert.equal(high.risk_score, "HIGH");
});
