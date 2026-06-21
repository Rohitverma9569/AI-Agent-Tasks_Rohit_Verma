# Live Traffic Proof

> **Date:** 2026-06-21  
> **Status:** PASS — metrics increased measurably after load generation

### Live links (verify in UI)

| Where to check | URL |
| -------------- | --- |
| **Grafana dashboard** | [http://localhost:3000/d/d6-app-dashboard](http://localhost:3000/d/d6-app-dashboard) |
| Prometheus query UI | [http://localhost:9090/graph](http://localhost:9090/graph) |
| App metrics | [http://localhost:8008/metrics](http://localhost:8008/metrics) |

---

## Procedure

1. Query Prometheus total requests **before** load
2. Run `./scripts/load-test.sh` (100 requests)
3. Query Prometheus and curl `/metrics` **after** load
4. Confirm dashboard PromQL values reflect increase

---

## Prometheus: before load

```bash
curl -s -G 'http://localhost:9090/api/v1/query' \
  --data-urlencode 'query=sum(http_requests_total{job="d6-demo-api"})'
```

```json
{"status":"success","data":{"resultType":"vector","result":[{"metric":{},"value":[1782050957.580,"3"]}]}}
```

**Total requests:** 3 (health checks + scrape probes only)

---

## Load test executed

```
Load Test Summary
  Total requests: 100
  Successful (200): 100
  Client errors: 0
  Duration: 2s
```

Plus 10 intentional `/api/error` calls (500 responses).

---

## Prometheus: after load

```json
{"status":"success","data":{"resultType":"vector","result":[{"metric":{},"value":[1782050959.871,"109"]}]}}
```

**Total requests:** 109 (+106 from traffic)

```json
{"status":"success","data":{"resultType":"vector","result":[{"metric":{},"value":[1782050959.890,"9"]}]}}
```

**Error count:** 9–10 (Prometheus scrape timing; app `/metrics` shows 10.0)

---

## Application `/metrics` after load

```
http_requests_total{endpoint="/health",method="GET",status="200"} 5.0
http_requests_total{endpoint="/api/items",method="GET",status="200"} 100.0
http_requests_total{endpoint="/api/error",method="GET",status="500"} 10.0
http_errors_total{endpoint="/api/error",method="GET",status="500"} 10.0
```

Command: `curl -s http://localhost:8008/metrics | grep -E '^http_requests_total|^http_errors_total'`

---

## Conclusion

| Check | Before | After | Delta |
| ----- | ------ | ----- | ----- |
| Total requests (Prometheus) | 3 | 109 | +106 |
| `/api/items` count (app metrics) | 0 | 100 | +100 |
| Error count (app metrics) | 0 | 10 | +10 |

Dashboard panels **Total Requests**, **Requests Per Second**, and **Error Count** reflect live traffic without manual refresh beyond the 5s auto-refresh interval.
