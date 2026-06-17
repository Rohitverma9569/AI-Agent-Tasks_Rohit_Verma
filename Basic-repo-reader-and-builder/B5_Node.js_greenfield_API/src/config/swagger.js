const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Transaction API",
      version: "1.0.0",
      description:
        "In-memory transaction ledger with credit/debit support. " +
        "Manage transactions and query the running balance.",
      contact: {
        name: "B5 Transaction Service",
      },
    },
    servers: [
      {
        url: "http://127.0.0.1:3000",
        description: "Local development",
      },
    ],
    tags: [
      { name: "Transactions", description: "Create and list transactions" },
      { name: "Balance", description: "Account balance queries" },
      { name: "Health", description: "Service health checks" },
    ],
    components: {
      schemas: {
        TransactionType: {
          type: "string",
          enum: ["credit", "debit"],
          example: "credit",
        },
        TransactionCreate: {
          type: "object",
          required: ["amount", "type"],
          properties: {
            amount: {
              type: "number",
              format: "float",
              exclusiveMinimum: 0,
              example: 100.5,
              description: "Transaction amount (must be positive)",
            },
            type: {
              $ref: "#/components/schemas/TransactionType",
            },
            timestamp: {
              type: "string",
              format: "date-time",
              example: "2026-06-17T12:00:00.000Z",
              description: "Optional; defaults to current UTC time if omitted",
            },
          },
        },
        Transaction: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "550e8400-e29b-41d4-a716-446655440000",
            },
            amount: { type: "number", example: 100.5 },
            type: { $ref: "#/components/schemas/TransactionType" },
            timestamp: {
              type: "string",
              format: "date-time",
              example: "2026-06-17T12:00:00.000Z",
            },
          },
        },
        BalanceResponse: {
          type: "object",
          properties: {
            balance: {
              type: "number",
              example: 75,
              description: "Sum of credits minus debits",
            },
            transaction_count: {
              type: "integer",
              example: 2,
            },
          },
        },
        ValidationError: {
          type: "object",
          properties: {
            message: { type: "string", example: "Validation failed" },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
        HealthResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "ok" },
          },
        },
      },
    },
    paths: {
      "/transactions": {
        get: {
          tags: ["Transactions"],
          summary: "List all transactions",
          description: "Returns every transaction stored in memory.",
          responses: {
            200: {
              description: "List of transactions",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Transaction" },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["Transactions"],
          summary: "Create a transaction",
          description: "Adds a credit or debit transaction to the in-memory ledger.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TransactionCreate" },
              },
            },
          },
          responses: {
            201: {
              description: "Transaction created",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Transaction" },
                },
              },
            },
            422: {
              description: "Validation error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ValidationError" },
                },
              },
            },
          },
        },
      },
      "/balance": {
        get: {
          tags: ["Balance"],
          summary: "Get current balance",
          description: "Returns credits minus debits and total transaction count.",
          responses: {
            200: {
              description: "Current balance",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/BalanceResponse" },
                },
              },
            },
          },
        },
      },
      "/health": {
        get: {
          tags: ["Health"],
          summary: "Health check",
          responses: {
            200: {
              description: "Service is healthy",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/HealthResponse" },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec, swaggerOptions: options };
