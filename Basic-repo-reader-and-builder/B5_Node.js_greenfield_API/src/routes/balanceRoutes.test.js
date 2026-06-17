const request = require("supertest");
const express = require("express");
const balanceRoutes = require("./balanceRoutes");
const { store } = require("../services/transactionStore");

describe("balanceRoutes", () => {
  beforeEach(() => {
    store.clear();
  });

  test("GET /balance returns zero for empty store", async () => {
    const app = express();
    app.use("/", balanceRoutes);
    const response = await request(app).get("/balance");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ balance: 0, transaction_count: 0 });
  });
});
