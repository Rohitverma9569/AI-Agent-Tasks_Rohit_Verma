exports.handler = async () => ({
  statusCode: 200,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    status: "ok",
    service: "d1-small-service",
    timestamp: new Date().toISOString(),
  }),
});
