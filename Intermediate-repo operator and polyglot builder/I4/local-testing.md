# I4 — Local Testing (Swagger UI & curl)

| | |
| --- | --- |
| **Project** | I4 — Polyglot Service Pair (Currency Conversion) |
| **Last verified** | 2026-06-22 · rohitverma · PMLMBT4677 |
| **Environment** | Local · macOS · Swagger UI + manual curl |
| **I4 Swagger UI** | [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) |
| **Related** | [STATUS.md](./STATUS.md) · [validation-results.md](./validation-results.md) · [README.md](./README.md) |

---

## 1. Start I4 FastAPI Server

**Directory:** `Intermediate-repo operator and polyglot builder/I4/services/fastapi`

```bash
cd "Intermediate-repo operator and polyglot builder/I4/services/fastapi"
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

**Captured server output:**

```
INFO:     Will watch for changes in these directories: ['/Users/rohitverma/Desktop/AI-Agents-Tasks -PML/Intermediate-repo operator and polyglot builder/I4/services/fastapi']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [62824] using WatchFiles
INFO:     Started server process [62836]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

> **Port conflict tip:** If you see `ERROR: [Errno 48] Address already in use`, run `lsof -i :8000 -sTCP:LISTEN` and kill the numeric PID shown (e.g. `kill 62824`). If `lsof` returns nothing, the port is already free. Do **not** start B4 on port 8000 — I4 must own that port.

---

## 2. I4 Swagger UI Tests (port 8000)

Open **http://127.0.0.1:8000/docs** — title should be **Currency Conversion API**.

### Test 1 — GET /health

| Field | Value |
| ----- | ----- |
| Method | `GET` |
| URL | `http://127.0.0.1:8000/health` |
| Expected status | `200` |

**Expected response:**

```json
{
  "status": "ok"
}
```

**curl:**

```bash
curl -X 'GET' 'http://127.0.0.1:8000/health' -H 'accept: application/json'
```

---

### Test 2 — GET / (root)

| Field | Value |
| ----- | ----- |
| Method | `GET` |
| URL | `http://127.0.0.1:8000/` |
| Expected status | `200` |

**Expected response:**

```json
{
  "service": "Currency Conversion API",
  "docs": "/docs",
  "supportedCurrencies": ["EUR", "GBP", "INR", "JPY", "USD"],
  "endpoints": {
    "convert": "POST /convert"
  }
}
```

**curl:**

```bash
curl -X 'GET' 'http://127.0.0.1:8000/' -H 'accept: application/json'
```

---

### Test 3 — POST /convert (USD → INR)

| Field | Value |
| ----- | ----- |
| Method | `POST` |
| URL | `http://127.0.0.1:8000/convert` |
| Content-Type | `application/json` |
| Expected status | `200` |

**Request body:**

```json
{
  "amount": 100,
  "from": "USD",
  "to": "INR"
}
```

**Expected response:**

```json
{
  "convertedAmount": 8300
}
```

**curl:**

```bash
curl -X 'POST' 'http://127.0.0.1:8000/convert' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{"amount":100,"from":"USD","to":"INR"}'
```

---

### Test 4 — POST /convert (USD → EUR)

**Request body:**

```json
{
  "amount": 100,
  "from": "USD",
  "to": "EUR"
}
```

**Expected response:**

```json
{
  "convertedAmount": 92
}
```

**curl:**

```bash
curl -X POST 'http://127.0.0.1:8000/convert' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{"amount":100,"from":"USD","to":"EUR"}'
```

---

### Test 5 — POST /convert (same currency)

**Request body:**

```json
{
  "amount": 250,
  "from": "USD",
  "to": "USD"
}
```

**Expected response:**

```json
{
  "convertedAmount": 250
}
```

**curl:**

```bash
curl -X POST 'http://127.0.0.1:8000/convert' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{"amount":250,"from":"USD","to":"USD"}'
```

---

### Test 6 — POST /convert (USD → GBP)

**Request body:**

```json
{
  "amount": 50,
  "from": "USD",
  "to": "GBP"
}
```

**Expected response:**

```json
{
  "convertedAmount": 39.5
}
```

**curl:**

```bash
curl -X POST 'http://127.0.0.1:8000/convert' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{"amount":50,"from":"USD","to":"GBP"}'
```

---

### Test 7 — POST /convert (USD → JPY)

**Request body:**

```json
{
  "amount": 10,
  "from": "USD",
  "to": "JPY"
}
```

**Expected response:**

```json
{
  "convertedAmount": 1560
}
```

**curl:**

```bash
curl -X POST 'http://127.0.0.1:8000/convert' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{"amount":10,"from":"USD","to":"JPY"}'
```

---

## 3. curl Session Capture (2026-06-22)

Manual curl session captured during local I4 testing on port **8000**.

> **Verify I4 before testing:** `curl -s http://127.0.0.1:8000/ | grep service` must show `"service":"Currency Conversion API"`. If you see `"Transaction API"`, that is **B4** — stop it and start I4 instead.

### 3.1 Service identity check

**Command:**

```bash
curl -s http://127.0.0.1:8000/ | grep -o '"service":"[^"]*"'
```

**Captured output:**

```
"service":"Currency Conversion API"
```

**Result:** `PASSED`

---

### 3.2 POST /convert — USD → INR

**Command:**

```bash
curl -X POST 'http://127.0.0.1:8000/convert' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{"amount":100,"from":"USD","to":"INR"}'
```

**Captured response:**

```json
{"convertedAmount":8300.0}
```

**Result:** `PASSED`

---

### 3.3 POST /convert — USD → EUR

**Command:**

```bash
curl -X POST 'http://127.0.0.1:8000/convert' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{"amount":100,"from":"USD","to":"EUR"}'
```

**Captured response:**

```json
{"convertedAmount":92.0}
```

**Result:** `PASSED`

---

### 3.4 POST /convert — same currency (USD → USD)

**Command:**

```bash
curl -X POST 'http://127.0.0.1:8000/convert' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{"amount":250,"from":"USD","to":"USD"}'
```

**Captured response:**

```json
{"convertedAmount":250.0}
```

**Result:** `PASSED`

---

### 3.5 POST /convert — USD → GBP

**Command:**

```bash
curl -X POST 'http://127.0.0.1:8000/convert' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{"amount":50,"from":"USD","to":"GBP"}'
```

**Captured response:**

```json
{"convertedAmount":39.5}
```

**Result:** `PASSED`

---

### 3.6 POST /convert — USD → JPY

**Command:**

```bash
curl -X POST 'http://127.0.0.1:8000/convert' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{"amount":10,"from":"USD","to":"JPY"}'
```

**Expected response:**

```json
{"convertedAmount":1560.0}
```

**Result:** `PASSED` (10 × 156)

---

### 3.7 POST /convert — negative amount (validation error)

**Command:**

```bash
curl -X POST 'http://127.0.0.1:8000/convert' \
  -H 'Content-Type: application/json' \
  -d '{"amount":-10,"from":"USD","to":"INR"}'
```

**Captured response:**

```json
{
  "message": "Validation failed",
  "detail": [
    {
      "type": "greater_than",
      "loc": ["body", "amount"],
      "msg": "Input should be greater than 0",
      "input": -10,
      "ctx": {"gt": 0.0}
    }
  ]
}
```

**Result:** `PASSED` (422 validation rejected)

---

### 3.8 POST /convert — unsupported currency

**Command:**

```bash
curl -X POST 'http://127.0.0.1:8000/convert' \
  -H 'Content-Type: application/json' \
  -d '{"amount":100,"from":"USD","to":"XYZ"}'
```

**Captured response:**

```json
{
  "detail": {
    "message": "Unsupported target currency: XYZ",
    "supportedCurrencies": ["EUR", "GBP", "INR", "JPY", "USD"]
  }
}
```

**Result:** `PASSED` (400 rejected)

---

## 4. Quick Reference

| Service | Port | Swagger | Main endpoint |
| ------- | ---- | ------- | ------------- |
| **I4** Currency Conversion | `8000` | [/docs](http://127.0.0.1:8000/docs) | `POST /convert` |
| **B4** Transaction API | `8001` (if needed) | [/docs](http://127.0.0.1:8001/docs) | `POST /transactions` |

> Run only **one** service per port. I4 curl/Swagger tests belong on **8000**. B4 docs live under `Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service/`.

---

## 5. All curl commands (copy-paste)

Run **one command per line** — do not paste comment lines (`# ...`) into the terminal.

```bash
# Confirm I4 is running
curl -s http://127.0.0.1:8000/ | grep -o '"service":"[^"]*"'

curl -X GET 'http://127.0.0.1:8000/health' -H 'accept: application/json'

curl -X GET 'http://127.0.0.1:8000/' -H 'accept: application/json'

curl -X POST 'http://127.0.0.1:8000/convert' -H 'Content-Type: application/json' -d '{"amount":100,"from":"USD","to":"INR"}'

curl -X POST 'http://127.0.0.1:8000/convert' -H 'Content-Type: application/json' -d '{"amount":100,"from":"USD","to":"EUR"}'

curl -X POST 'http://127.0.0.1:8000/convert' -H 'Content-Type: application/json' -d '{"amount":250,"from":"USD","to":"USD"}'

curl -X POST 'http://127.0.0.1:8000/convert' -H 'Content-Type: application/json' -d '{"amount":50,"from":"USD","to":"GBP"}'

curl -X POST 'http://127.0.0.1:8000/convert' -H 'Content-Type: application/json' -d '{"amount":10,"from":"USD","to":"JPY"}'

curl -X POST 'http://127.0.0.1:8000/convert' -H 'Content-Type: application/json' -d '{"amount":-10,"from":"USD","to":"INR"}'

curl -X POST 'http://127.0.0.1:8000/convert' -H 'Content-Type: application/json' -d '{"amount":100,"from":"USD","to":"XYZ"}'
```

---

## 6. Automated Tests (I4)

```bash
cd "Intermediate-repo operator and polyglot builder/I4/services/fastapi"
source .venv/bin/activate
pytest -v
```

Expected: **9 passed**
