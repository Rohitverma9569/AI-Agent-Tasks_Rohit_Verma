const {
  createTransaction,
  getBalance,
} = require("./transactionController");
const { store } = require("../services/transactionStore");

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("transactionController", () => {
  beforeEach(() => {
    store.clear();
  });

  test("createTransaction returns 201", () => {
    const req = { body: { amount: 100, type: "credit" } };
    const res = mockRes();
    const next = jest.fn();

    createTransaction(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("getBalance returns balance payload", () => {
    store.create({ amount: 100, type: "credit" });
    const res = mockRes();
    getBalance({}, res, jest.fn());
    expect(res.json).toHaveBeenCalledWith({ balance: 100, transaction_count: 1 });
  });
});
