import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";

import { startWorker } from "../src/index.js";

test("startWorker opens database without starting loop when interval disabled", () => {
  const dbPath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "fraud-")), "test.db");
  const worker = startWorker({ dbPath, pollIntervalMs: 60_000 });
  assert.ok(worker.db);
  worker.shutdown();
});
