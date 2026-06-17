const request = require("supertest");
const express = require("express");
const balanceRoutes = require("../src/routes/balanceRoutes");
const { store } = require("../src/services/transactionStore");

describe("balanceRoutes", () => {
  let app;

  beforeEach(() => {
    store.clear();
    app = express();
    app.use("/", balanceRoutes);
  });

  test("GET /balance returns zero for empty store", async () => {
    const response = await request(app).get("/balance");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ balance: 0, transaction_count: 0 });
  });
});
