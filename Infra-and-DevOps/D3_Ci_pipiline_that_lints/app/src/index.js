const express = require("express");
const { healthResponse } = require("./health");

const PORT = parseInt(process.env.PORT || "3000", 10);
const app = express();

app.get("/health", (_req, res) => {
  res.json(healthResponse());
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`d3-ci-demo listening on ${PORT}`);
  });
}

module.exports = app;
