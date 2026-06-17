import assert from "node:assert/strict";
import { test } from "node:test";

import { invokeRustEngine } from "../src/rustClient.js";

test("invokeRustEngine posts payload and returns score", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "http://engine/score");
    assert.equal(options.method, "POST");
    const body = JSON.parse(options.body);
    assert.equal(body.transaction_id, "tx-1");
    return {
      ok: true,
      async json() {
        return {
          transaction_id: "tx-1",
          risk_score: "LOW",
          score_value: 0.15,
          reasons: ["amount_within_normal_range"],
        };
      },
    };
  };

  try {
    const result = await invokeRustEngine("http://engine", {
      transaction_id: "tx-1",
      user_id: "u1",
      merchant_id: "M1",
      amount: 10,
      currency: "USD",
    });
    assert.equal(result.risk_score, "LOW");
  } finally {
    globalThis.fetch = originalFetch;
  }
});
