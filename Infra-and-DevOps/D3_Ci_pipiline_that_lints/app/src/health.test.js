const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { healthResponse } = require("./health");

describe("health", () => {
  it("returns ok status", () => {
    const res = healthResponse();
    assert.equal(res.status, "ok");
    assert.equal(res.service, "d3-ci-demo");
  });

  it("includes version", () => {
    const res = healthResponse();
    assert.equal(typeof res.version, "string");
    assert.ok(res.version.length > 0);
  });
});
