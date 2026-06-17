const express = require("express");
const swaggerUi = require("swagger-ui-express");
const transactionRoutes = require("./routes/transactionRoutes");
const balanceRoutes = require("./routes/balanceRoutes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");
const { swaggerSpec } = require("./config/swagger");

function createApp() {
  const app = express();

  app.use(express.json());

  app.get("/api-docs", (_req, res) => {
    res.json(swaggerSpec);
  });

  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: "Transaction API — Swagger UI",
      customCss: ".swagger-ui .topbar { display: none }",
      swaggerOptions: {
        docExpansion: "list",
        defaultModelsExpandDepth: 2,
        tryItOutEnabled: true,
      },
    })
  );

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/", (_req, res) => {
    res.json({
      service: "Transaction API",
      docs: "/docs",
      openapi: "/api-docs",
      endpoints: {
        create_transaction: "POST /transactions",
        list_transactions: "GET /transactions",
        balance: "GET /balance",
      },
    });
  });

  app.use("/transactions", transactionRoutes);
  app.use("/", balanceRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
