const { swaggerSpec } = require("./swagger");

describe("swaggerSpec", () => {
  test("defines transaction and balance paths", () => {
    expect(swaggerSpec.openapi).toMatch(/^3\./);
    expect(swaggerSpec.info.title).toBe("Transaction API");
    expect(swaggerSpec.paths["/transactions"]).toBeDefined();
    expect(swaggerSpec.paths["/balance"]).toBeDefined();
  });
});
