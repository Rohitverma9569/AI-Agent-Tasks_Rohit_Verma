describe("index entry", () => {
  test("starts server via createApp().listen", () => {
    const listen = jest.fn((port, cb) => cb && cb());
    jest.isolateModules(() => {
      jest.doMock("../src/app", () => ({
        createApp: () => ({ listen }),
      }));
      require("../src/index");
    });
    expect(listen).toHaveBeenCalledWith(3000, expect.any(Function));
  });
});
