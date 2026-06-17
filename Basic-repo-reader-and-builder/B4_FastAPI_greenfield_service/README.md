# Transaction API (B4)

Production-quality FastAPI service with in-memory transaction storage.

## Endpoints

| Method | Route | Description |
| ------ | ----- | ----------- |
| POST | `/transactions` | Create a transaction |
| GET | `/transactions` | List all transactions |
| GET | `/balance` | Current balance (credits − debits) |

### Transaction schema

```json
{
  "id": "string",
  "amount": 100.0,
  "type": "credit",
  "timestamp": "2026-06-17T12:00:00Z"
}
```

`id` is auto-generated on create. `timestamp` defaults to UTC now if omitted.

## Project structure

```
B4_FastAPI_greenfield_service/
├── app/
│   ├── main.py       # FastAPI app, logging, error handlers
│   ├── models.py     # Pydantic models
│   ├── routes.py     # API routes
│   └── storage.py    # In-memory store
├── tests/
│   ├── conftest.py
│   └── test_transactions.py
├── requirements.txt
└── README.md
```

## Setup

```bash
cd Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Run tests

```bash
pytest -v
```

## Run server

```bash
uvicorn app.main:app --reload
```

Open http://127.0.0.1:8000/docs for Swagger UI.

## Example

```bash
curl -X POST http://127.0.0.1:8000/transactions \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "type": "credit"}'

curl http://127.0.0.1:8000/transactions
curl http://127.0.0.1:8000/balance
```

## Validation

See [validation-results.md](validation-results.md) for executed `pytest` and `uvicorn` output (5 tests passed).
