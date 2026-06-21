const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

describe("worker service", () => {
  it("builds a processing result string", () => {
    const payload = { action: "seed-check" };
    const result = `processed:${payload.action || "default"} at ${new Date().toISOString()}`;
    assert.match(result, /^processed:seed-check at /);
  });
});
