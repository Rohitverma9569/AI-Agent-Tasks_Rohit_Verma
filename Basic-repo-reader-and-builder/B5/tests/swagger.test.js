const request = require("supertest");
const { createApp } = require("../src/app");

describe("Swagger UI", () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  test("GET /docs serves Swagger UI", async () => {
    const response = await request(app).get("/docs/");
    expect(response.status).toBe(200);
    expect(response.text).toContain("swagger");
  });

  test("GET /api-docs returns OpenAPI JSON", async () => {
    const response = await request(app).get("/api-docs");
    expect(response.status).toBe(200);
    expect(response.body.openapi).toMatch(/^3\./);
    expect(response.body.info.title).toBe("Transaction API");
    expect(response.body.paths["/transactions"]).toBeDefined();
    expect(response.body.paths["/balance"]).toBeDefined();
  });
});
