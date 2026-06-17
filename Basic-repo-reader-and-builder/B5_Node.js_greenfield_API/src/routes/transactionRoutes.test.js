const request = require("supertest");
const express = require("express");
const transactionRoutes = require("./transactionRoutes");
const { store } = require("../services/transactionStore");

describe("transactionRoutes", () => {
  let app;

  beforeEach(() => {
    store.clear();
    app = express();
    app.use(express.json());
    app.use("/transactions", transactionRoutes);
  });

  test("POST / creates transaction", async () => {
    const response = await request(app)
      .post("/transactions")
      .send({ amount: 50, type: "debit" });
    expect(response.status).toBe(201);
  });
});
