# Load Test Results

> **Script:** `scripts/load-test.sh`  
> **Date:** 2026-06-21  
> **Status:** PASS

### Live links (after load test)

| Check results in | URL |
| ---------------- | --- |
| **Grafana dashboard** | [http://localhost:3000/d/d6-app-dashboard](http://localhost:3000/d/d6-app-dashboard) |
| Prometheus targets | [http://localhost:9090/targets](http://localhost:9090/targets) |
| App metrics | [http://localhost:8008/metrics](http://localhost:8008/metrics) |

---

## Configuration

| Variable | Value |
| -------- | ----- |
| API_URL | `http://localhost:8008` |
| REQUEST_COUNT | 100 |

---

## Command

```bash
cd Infra-and-DevOps/D6_Observability_bolt_on_with_metrics
chmod +x scripts/load-test.sh
./scripts/load-test.sh
```

**Exit code:** 0

---

## Output

```
==> D6 Load Test (FastAPI)
    API_URL=http://localhost:8008
    REQUEST_COUNT=100

========================================
Load Test Summary
  Total requests: 100
  Successful (200): 100
  Client errors: 0
  Duration: 2s
========================================
```

---

## Traffic pattern

- 100 sequential `GET /api/items` requests (expect 200)
- Every 10th iteration: additional `GET /api/error` (intentional 500) → 10 error responses total

---

## Duration

| Metric | Value |
| ------ | ----- |
| Wall clock | ~2.5s |
| Reported duration | 2s |
