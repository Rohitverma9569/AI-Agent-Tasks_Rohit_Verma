const { notFoundHandler, errorHandler } = require("../src/middleware/errorHandler");

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("errorHandler middleware", () => {
  test("notFoundHandler returns 404", () => {
    const req = { originalUrl: "/missing" };
    const res = mockRes();

    notFoundHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("errorHandler returns error message", () => {
    const err = new Error("boom");
    const req = { method: "GET", originalUrl: "/fail" };
    const res = mockRes();

    errorHandler(err, req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "boom" })
    );
  });
});
