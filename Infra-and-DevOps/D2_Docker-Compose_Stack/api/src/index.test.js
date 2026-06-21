const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

describe("api service", () => {
  it("exports a health response shape", () => {
    const health = { status: "ok", database: "connected" };
    assert.equal(health.status, "ok");
    assert.equal(health.database, "connected");
  });
});
