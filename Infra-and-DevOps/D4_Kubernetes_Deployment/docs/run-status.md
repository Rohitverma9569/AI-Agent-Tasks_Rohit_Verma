# D4 Kubernetes Deployment — Local Verification Status

| | |
| --- | --- |
| **Project** | D4 — Kubernetes Deployment |
| **Target app** | `Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service` |
| **Cluster** | kind · `d4-b4` |
| **Verified by** | rohitverma · PMLMBT4677 |
| **Run date** | 2026-06-21 |
| **Agent** | [`agent.md`](../agent.md) · `/kubernetes-deployment` |

---

## Executive Summary

| Metric | Result |
| ------ | ------ |
| **Overall status** | ✅ **PASS** |
| **kind cluster** | Created (`d4-b4`) |
| **Docker image** | Built and loaded |
| **Deployment rollout** | **2/2 pods Running** |
| **Health check** | `{"status":"ok"}` on port **18080** |
| **Exit code (curl)** | **0** |

The B4 Transaction API is deployed on Kubernetes and reachable via `kubectl port-forward`.

---

## How to Test (Quick Reference)

| Step | Command |
| ---- | ------- |
| 1. Deploy | `kubectl apply -f k8s/` (re-run if namespace race) |
| 2. Wait | `kubectl rollout status deployment/b4-transaction-api -n b4` |
| 3. Forward port | `kubectl port-forward svc/b4-transaction-api 18080:8000 -n b4` |
| 4. Test | `curl http://127.0.0.1:18080/health` |

**Expected:** `{"status":"ok"}`

| Port | Meaning |
| ---- | ------- |
| **8000** | Inside cluster (Service / Pod) |
| **18080** | On your Mac (after port-forward) |

---

## Step 1 — Initial Deploy

**Commands:**

```bash
cd Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service

kind create cluster --name d4-b4
docker build -t b4-transaction-api:local .
kind load docker-image b4-transaction-api:local --name d4-b4
kubectl apply -f k8s/
kubectl rollout status deployment/b4-transaction-api -n b4
```

### Results

| Step | Result |
| ---- | ------ |
| kind cluster | ✅ Created · context `kind-d4-b4` |
| Docker build | ✅ `Successfully tagged b4-transaction-api:local` |
| kind load | ✅ Image loaded to control plane |
| First `kubectl apply` | ⚠️ **Partial** — see note below |

### First apply — partial success (namespace race)

```
namespace/b4 created
service/b4-transaction-api created
Error from server (NotFound): error when creating "k8s/configmap.yaml": namespaces "b4" not found
Error from server (NotFound): error when creating "k8s/deployment.yaml": namespaces "b4" not found
Error from server (NotFound): deployments.apps "b4-transaction-api" not found
```

**Cause:** ConfigMap and Deployment were applied before the namespace was fully ready.

**Fix:** Re-run `kubectl apply -f k8s/` (safe to repeat).

---

## Step 2 — Re-apply and Rollout

**Commands:**

```bash
kubectl apply -f k8s/
kubectl rollout status deployment/b4-transaction-api -n b4
kubectl get pods,svc -n b4
```

### Results

```
configmap/b4-transaction-api-config created
deployment.apps/b4-transaction-api created
namespace/b4 unchanged
service/b4-transaction-api unchanged

deployment "b4-transaction-api" successfully rolled out
```

### Pods

| Pod | Ready | Status | Restarts |
| --- | ----- | ------ | -------- |
| `b4-transaction-api-6dc46f7b7c-kwgbt` | 1/1 | Running | 0 |
| `b4-transaction-api-6dc46f7b7c-th5wn` | 1/1 | Running | 0 |

### Service

| Name | Type | Cluster-IP | Port |
| ---- | ---- | ---------- | ---- |
| `b4-transaction-api` | ClusterIP | 10.96.25.231 | 8000/TCP |

```
┌─────────────────────────────────────┐
│  ROLLOUT SUMMARY                    │
├─────────────────────────────────────┤
│  Replicas   2/2 Running             │
│  Rollout    successful              │
│  Service    ClusterIP :8000         │
└─────────────────────────────────────┘
```

---

## Step 3 — Port Forward

**Terminal 1** (keep running):

```bash
kubectl port-forward svc/b4-transaction-api 18080:8000 -n b4
```

**Output:**

```
Forwarding from 127.0.0.1:18080 -> 8000
Forwarding from [::1]:18080 -> 8000
Handling connection for 18080
```

> Use **18080** locally if port **8000** is already in use on your Mac.

---

## Step 4 — Runtime Verification (curl)

**Terminal 2:**

```bash
curl http://127.0.0.1:18080/health
```

**Response:**

```json
{"status":"ok"}
```

| Check | Expected | Actual |
| ----- | -------- | ------ |
| HTTP status | 200 | ✅ 200 |
| Body | `{"status":"ok"}` | ✅ Match |
| Exit code | 0 | ✅ 0 |

### Optional extra checks

```bash
curl http://127.0.0.1:18080/balance
curl http://127.0.0.1:18080/
open http://127.0.0.1:18080/docs
```

---

## Sign-off Checklist

| Requirement | Status |
| ----------- | ------ |
| kind cluster running | ✅ Verified |
| Image built and loaded | ✅ Verified |
| Namespace + manifests applied | ✅ Verified (after re-apply) |
| 2 pods Running and Ready | ✅ Verified |
| Rollout successful | ✅ Verified |
| Port-forward works | ✅ Verified |
| curl `/health` returns ok | ✅ Verified |

---

## Re-run Verification

```bash
cd Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service

kubectl apply -f k8s/
kubectl rollout status deployment/b4-transaction-api -n b4
kubectl get pods,svc -n b4

# Terminal 1
kubectl port-forward svc/b4-transaction-api 18080:8000 -n b4

# Terminal 2
curl http://127.0.0.1:18080/health
```

---

## Teardown

```bash
kubectl delete -f k8s/
kind delete cluster --name d4-b4
```

---

## Related Documentation

| Document | Description |
| -------- | ----------- |
| [README.md](../README.md) | Up/down commands, test guide, cheat sheet |
| [kubernetes-deployment-report.md](kubernetes-deployment-report.md) | Full agent deployment report |
| [agent.md](../agent.md) | D4 agent spec |
| [B4 k8s/README.md](../../Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service/k8s/README.md) | Manifest deploy instructions |

---

<p align="center"><sub>D4 Kubernetes Deployment · Local Verification Status · 2026-06-21</sub></p>
