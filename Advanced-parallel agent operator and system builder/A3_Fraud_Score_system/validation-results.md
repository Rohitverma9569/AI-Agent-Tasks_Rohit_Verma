# Validation Results — A3 Fraud Scoring System

> **Generated:** 2026-06-17  
> **Project:** `A3_Fraud_Score_system`

---

## Rust tests

```bash
cd engines/rust && cargo test
```

```
running 4 tests
test scorer::tests::low_amount_returns_low_risk ... ok
test scorer::tests::high_amount_returns_high_risk ... ok
test scorer::tests::suspicious_merchant_bumps_risk ... ok
test scorer::tests::medium_amount_returns_medium_risk ... ok

test result: ok. 4 passed; 0 failed
```

---

## FastAPI tests

```bash
cd services/fastapi
source .venv/bin/activate
pytest -q
```

```
....                                                                     [100%]
4 passed, 2 warnings in 0.36s
```

---

## Node worker tests

```bash
cd workers/node && npm test
```

```
✔ config exposes db path and rust engine url
✔ claimNextJob returns pending processing payload
✔ completeJob stores risk score on transaction
✔ startWorker opens database without starting loop when interval disabled
✔ processNextJob invokes rust client and completes transaction
✔ invokeRustEngine posts payload and returns score
✔ scoreTransaction maps LOW/MEDIUM/HIGH from amount rules
ℹ tests 7
ℹ pass 7
ℹ fail 0
```

---

## Integration test (full stack)

```bash
./scripts/run-all.sh
```

```
==> Building Rust engine
    Finished `release` profile [optimized] target(s) in 0.21s
==> Starting Rust engine on :3001
==> Starting Node worker
==> Starting FastAPI on :8000
==> Waiting for FastAPI health
INFO:     127.0.0.1:50434 - "GET /health HTTP/1.1" 200 OK
==> Running integration test
INFO:     127.0.0.1:50435 - "POST /transactions HTTP/1.1" 201 Created
Processed 56e44e4a-e371-463d-997b-ea09e6b3eba1 -> HIGH (0.92)
Integration: POST /transactions
  created transaction 56e44e4a-e371-463d-997b-ea09e6b3eba1
  scored 56e44e4a-e371-463d-997b-ea09e6b3eba1: HIGH (value=0.92, reasons=['amount_exceeds_high_threshold'])
Integration test PASSED
==> All services ran successfully
```

---

## Summary

| Layer | Command | Result |
| ----- | ------- | ------ |
| Rust unit | `cargo test` | 4/4 passed |
| FastAPI | `pytest -q` | 4/4 passed |
| Node | `npm test` | 7/7 passed |
| E2E | `./scripts/run-all.sh` | PASSED |
