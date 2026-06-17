# Transaction Service (B5)

Express.js transaction management API with in-memory storage, validation middleware, and Jest tests.

## Endpoints

| Method | Route | Description |
| ------ | ----- | ----------- |
| POST | `/transactions` | Create a transaction |
| GET | `/transactions` | List all transactions |
| GET | `/balance` | Current balance (credits − debits) |

### Transaction schema

```json
{
  "id": "uuid",
  "amount": 100,
  "type": "credit",
  "timestamp": "2026-06-17T12:00:00.000Z"
}
```

## Project structure

```
B5/
├── src/
│   ├── index.js              # Server entry
│   ├── app.js                # Express app factory
│   ├── controllers/
│   │   └── transactionController.js
│   ├── routes/
│   │   ├── transactionRoutes.js
│   │   └── balanceRoutes.js
│   ├── services/
│   │   └── transactionStore.js
│   └── middleware/
│       ├── validateTransaction.js
│       └── errorHandler.js
├── tests/
│   └── transactions.test.js  # Integration tests (+ co-located unit tests in src/)
├── package.json
└── README.md
```

## Setup

```bash
cd repo-reader-and-builder/B5
npm install
```

## Run tests

```bash
npm test
```

## Run server

```bash
npm start
```

Server listens on http://127.0.0.1:3000

## API documentation (Swagger UI)

Open **http://127.0.0.1:3000/docs** in your browser — interactive API docs like B4 FastAPI.

Raw OpenAPI JSON: http://127.0.0.1:3000/api-docs

## Example

```bash
curl -X POST http://127.0.0.1:3000/transactions \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "type": "credit"}'

curl http://127.0.0.1:3000/transactions
curl http://127.0.0.1:3000/balance
```

## Validation

See [validation-results.md](validation-results.md) for executed `npm install`, `npm test`, and `npm start` output.
