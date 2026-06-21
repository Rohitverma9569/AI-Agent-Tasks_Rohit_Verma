function healthResponse() {
  return {
    status: "ok",
    service: "d3-ci-demo",
    version: "1.0.0",
  };
}

module.exports = { healthResponse };
