# Currency Conversion API

FastAPI service that converts amounts between currencies using **hardcoded exchange rates**.

## Endpoints

| Method | Path | Description |
| ------ | ---- | ----------- |
| POST | `/convert` | Convert amount between currencies |
| GET | `/health` | Health check |
| GET | `/docs` | Swagger UI |

### POST /convert

**Request**

```json
{
  "amount": 100,
  "from": "USD",
  "to": "INR"
}
```

**Response**

```json
{
  "convertedAmount": 8300
}
```

**Supported currencies:** `USD`, `INR`, `EUR`, `GBP`, `JPY`

## Setup

```bash
cd services/fastapi
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Run

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

## Test

```bash
pytest -v
```

## Error handling

| Status | Cause |
| ------ | ----- |
| 422 | Invalid body (amount ≤ 0, bad currency format) |
| 400 | Unsupported currency code |
| 500 | Unexpected server error |

## Docker

Multi-stage image with built-in health check. See `I5/docker-report.md` for full layer breakdown.

### docker build

```bash
docker build -t currency-convert-api:latest .
```

### docker run

```bash
docker run -d --name currency-api -p 8000:8000 currency-convert-api:latest
```

### docker stop

```bash
docker stop currency-api
docker rm currency-api
```

### Verify health

```bash
curl -s http://127.0.0.1:8000/health
# {"status":"ok"}
```

### Verify convert

```bash
curl -s -X POST http://127.0.0.1:8000/convert \
  -H "Content-Type: application/json" \
  -d '{"amount":100,"from":"USD","to":"INR"}'
# {"convertedAmount":8300.0}
```
