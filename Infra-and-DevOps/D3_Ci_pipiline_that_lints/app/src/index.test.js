const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

describe("index entrypoint", () => {
  it("loads express app module without throwing", () => {
    assert.doesNotThrow(() => {
      require("./index");
    });
  });
});
