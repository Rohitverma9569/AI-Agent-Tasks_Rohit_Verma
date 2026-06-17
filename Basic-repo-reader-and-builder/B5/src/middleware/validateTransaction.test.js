const { validateTransaction } = require("./validateTransaction");

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("validateTransaction middleware", () => {
  test("calls next for valid payload", () => {
    const req = { body: { amount: 10, type: "credit" } };
    const res = mockRes();
    const next = jest.fn();
    validateTransaction(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test("returns 422 for negative amount", () => {
    const req = { body: { amount: -5, type: "credit" } };
    const res = mockRes();
    const next = jest.fn();
    validateTransaction(req, res, next);
    expect(res.status).toHaveBeenCalledWith(422);
  });
});
