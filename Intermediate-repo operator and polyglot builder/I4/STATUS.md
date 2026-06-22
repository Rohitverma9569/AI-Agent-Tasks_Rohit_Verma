# I4 — Project Status

| | |
| --- | --- |
| **Project** | I4 — Polyglot Service Pair (Currency Conversion) |
| **Overall status** | ✅ **Ready** — implemented, tested, locally runnable |
| **Last checked** | 2026-06-22 · rohitverma · PMLMBT4677 |
| **Environment** | Local · macOS |

---

## Running Status (live)

| Component | Status | Port / URL | Notes |
| --------- | ------ | ---------- | ----- |
| **FastAPI service** | 🟢 **Running** | [http://127.0.0.1:8000](http://127.0.0.1:8000) | uvicorn with `--reload` |
| **Swagger UI** | 🟢 **Available** | [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) | Currency Conversion API |
| **Health endpoint** | 🟢 **OK** | `GET /health` → `{"status":"ok"}` | Verified live |
| **Node CLI client** | ⚪ **On demand** | `clients/node-cli/cli.js` | Run manually; not a long-lived process |

### Live health check

```bash
curl -s http://127.0.0.1:8000/health
# {"status":"ok"}

curl -s http://127.0.0.1:8000/
# {"service":"Currency Conversion API","docs":"/docs",...}
```

### Process info (last observed)

| Field | Value |
| ----- | ----- |
| Port | `8000` |
| Host | `127.0.0.1` |
| Reloader PID | `62824` |
| Worker PID | `62836` |
| Command | `uvicorn app.main:app --reload --host 127.0.0.1 --port 8000` |
| Working directory | `I4/services/fastapi` |

> **Note:** PIDs change each time you restart the server. Re-check with `lsof -i :8000`.

---

## Component Summary

```
┌─────────────────────────────────────────────────────────┐
│  I4 RUNTIME STATUS                                      │
├─────────────────────────────────────────────────────────┤
│  FastAPI (Python)     🟢 RUNNING   port 8000            │
│  Node CLI             ⚪ ON DEMAND  calls POST /convert   │
│  Docker               ⚪ OPTIONAL  see services/fastapi   │
└─────────────────────────────────────────────────────────┘
```

| Layer | Technology | Path | Role |
| ----- | ---------- | ---- | ---- |
| API | FastAPI + uvicorn | `services/fastapi/` | Currency conversion REST API |
| Client | Node.js 18+ | `clients/node-cli/` | CLI that calls the API |
| Storage | None | — | Hardcoded exchange rates (in-memory) |

---

## Verification Status

| Check | Status | Evidence |
| ----- | ------ | -------- |
| Automated tests (`pytest -v`) | ✅ 9/9 passed | [validation-results.md §pytest](./validation-results.md#pytest) |
| Swagger UI manual tests | ✅ Passed | [validation-results.md §Swagger](./validation-results.md#swagger-ui-manual) |
| Manual curl session | ✅ Passed | [validation-results.md §curl](./validation-results.md#manual-curl-2026-06-22-session) |
| Node CLI end-to-end | ✅ Passed | [validation-results.md §cli](./validation-results.md#node-clijs) |
| Server startup | ✅ Passed | [validation-results.md §uvicorn](./validation-results.md#uvicorn-server-startup) |
| Local test guide | ✅ Complete | [local-testing.md](./local-testing.md) |

**Last full verification:** 2026-06-22 (Swagger UI + curl session on port 8000)

---

## Quick Commands

### Check if API is running

```bash
lsof -i :8000
curl -s http://127.0.0.1:8000/health
```

### Start API (if stopped)

```bash
cd "Intermediate-repo operator and polyglot builder/I4/services/fastapi"
source .venv/bin/activate
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Stop API

Press `Ctrl+C` in the uvicorn terminal, or:

```bash
kill $(lsof -t -i :8000)
```

### Run CLI (API must be running)

```bash
cd "Intermediate-repo operator and polyglot builder/I4/clients/node-cli"
node cli.js 100 USD INR
# Expected: 8300
```

### Run automated tests

```bash
cd "Intermediate-repo operator and polyglot builder/I4/services/fastapi"
source .venv/bin/activate
pytest -v
```

---

## Known Issues / Tips

| Issue | Resolution |
| ----- | ---------- |
| `Address already in use` on port 8000 | Run `lsof -i :8000 -sTCP:LISTEN` — if empty, port is free; if a PID appears, run `kill <number>`. Do not paste literal `<PID>`. |
| Swagger shows **Transaction API** | Wrong service — that is **B4**. Stop B4 and start I4; root must show **Currency Conversion API** on port **8000**. |
| `zsh: unknown file attribute` when pasting curls | Paste **one curl command at a time** — do not paste comment lines (`# Test 1...`) into the terminal. |
| CLI exit code `2` | API not reachable at `http://127.0.0.1:8000`. Start I4 FastAPI first. |

---

## Related Docs

| Document | Purpose |
| -------- | ------- |
| [README.md](./README.md) | Setup, architecture, API contract |
| [local-testing.md](./local-testing.md) | Swagger UI + curl step-by-step tests |
| [validation-results.md](./validation-results.md) | Captured test output & pass/fail evidence |
| [agent.md](./agent.md) | Polyglot Service Pair Agent spec |

---

## Status Legend

| Icon | Meaning |
| ---- | ------- |
| 🟢 | Running / available / passed |
| 🟡 | Degraded / partial / needs attention |
| 🔴 | Stopped / failed / unavailable |
| ⚪ | Not running (on-demand or optional) |
