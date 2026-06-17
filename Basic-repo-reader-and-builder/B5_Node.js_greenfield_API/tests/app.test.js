const { createApp } = require("../src/app");

describe("createApp", () => {
  test("returns express app with health endpoint", async () => {
    const request = require("supertest");
    const app = createApp();

    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});
