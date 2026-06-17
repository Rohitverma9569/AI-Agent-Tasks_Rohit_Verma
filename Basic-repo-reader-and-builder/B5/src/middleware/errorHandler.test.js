const { notFoundHandler, errorHandler } = require("./errorHandler");

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("errorHandler middleware", () => {
  test("notFoundHandler returns 404", () => {
    const res = mockRes();
    notFoundHandler({ originalUrl: "/missing" }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("errorHandler returns error message", () => {
    const res = mockRes();
    errorHandler(new Error("boom"), { method: "GET", originalUrl: "/fail" }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
