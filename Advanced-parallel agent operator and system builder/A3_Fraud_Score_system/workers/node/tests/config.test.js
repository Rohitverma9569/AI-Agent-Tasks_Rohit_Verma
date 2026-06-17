import assert from "node:assert/strict";
import { test } from "node:test";

import { config } from "../src/config.js";

test("config exposes db path and rust engine url", () => {
  assert.ok(config.dbPath.endsWith("fraud.db"));
  assert.ok(config.rustEngineUrl.startsWith("http"));
  assert.ok(config.pollIntervalMs > 0);
});
