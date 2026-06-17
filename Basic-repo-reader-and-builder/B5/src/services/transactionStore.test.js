const { TransactionStore } = require("./transactionStore");

describe("TransactionStore", () => {
  let store;

  beforeEach(() => {
    store = new TransactionStore();
  });

  test("create returns transaction with id and timestamp", () => {
    const txn = store.create({
      amount: 100,
      type: "credit",
      timestamp: "2026-06-17T10:00:00.000Z",
    });

    expect(txn.id).toBeDefined();
    expect(txn.amount).toBe(100);
    expect(txn.type).toBe("credit");
  });

  test("getBalance calculates credits minus debits", () => {
    store.create({ amount: 200, type: "credit" });
    store.create({ amount: 50, type: "debit" });

    expect(store.getBalance()).toEqual({ balance: 150, transaction_count: 2 });
  });
});
