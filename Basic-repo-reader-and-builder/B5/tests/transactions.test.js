const request = require("supertest");
const { createApp } = require("../src/app");
const { store } = require("../src/services/transactionStore");

describe("Transaction API", () => {
  let app;

  beforeEach(() => {
    store.clear();
    app = createApp();
  });

  test("POST /transactions creates a transaction", async () => {
    const response = await request(app)
      .post("/transactions")
      .send({
        amount: 150,
        type: "credit",
        timestamp: "2026-06-17T10:00:00.000Z",
      });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      amount: 150,
      type: "credit",
      timestamp: "2026-06-17T10:00:00.000Z",
    });
    expect(typeof response.body.id).toBe("string");
    expect(response.body.id.length).toBeGreaterThan(0);
  });

  test("GET /transactions returns all transactions", async () => {
    await request(app)
      .post("/transactions")
      .send({ amount: 100, type: "credit" });
    await request(app)
      .post("/transactions")
      .send({ amount: 25, type: "debit" });

    const response = await request(app).get("/transactions");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body.map((t) => t.type).sort()).toEqual(["credit", "debit"]);
  });

  test("GET /balance returns credits minus debits", async () => {
    await request(app)
      .post("/transactions")
      .send({ amount: 200, type: "credit" });
    await request(app)
      .post("/transactions")
      .send({ amount: 50, type: "debit" });
    await request(app)
      .post("/transactions")
      .send({ amount: 30, type: "credit" });

    const response = await request(app).get("/balance");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ balance: 180, transaction_count: 3 });
  });

  test("POST /transactions rejects invalid amount", async () => {
    const response = await request(app)
      .post("/transactions")
      .send({ amount: -10, type: "credit" });

    expect(response.status).toBe(422);
    expect(response.body.message).toBe("Validation failed");
  });
});
