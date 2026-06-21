# D4 — Kubernetes Deployment

Deploy containerized applications to a **local Kubernetes cluster** (kind or minikube) with validated manifests, rollout proof, and curl verification.

| | |
| --- | --- |
| **Agent** | [`agent.md`](agent.md) · slash command `/kubernetes-deployment` |
| **Current target app** | [`B4_FastAPI_greenfield_service`](../Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service) |
| **Manifests** | `B4_FastAPI_greenfield_service/k8s/` |
| **Reports** | [`docs/kubernetes-deployment-report.md`](docs/kubernetes-deployment-report.md) · [`docs/run-status.md`](docs/run-status.md) |

---

## Architecture

```
Developer
    │
    ├── kind cluster (d4-b4)
    │       │
    │       ├── Namespace: b4
    │       ├── Deployment: b4-transaction-api (2 replicas)
    │       ├── Service: ClusterIP :8000
    │       └── ConfigMap: app config
    │
    └── kubectl port-forward → localhost:18080 → pod :8000
            │
            └── curl /health, /balance, /transactions
```

---

## Start with the Agent (recommended)

In Cursor Agent chat:

| Scenario | Command |
| -------- | ------- |
| **Deploy B4 on kind** | `/kubernetes-deployment Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service kind` |
| **Another app** | `/kubernetes-deployment ~/path/to/app kind` |
| **minikube** | `/kubernetes-deployment Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service minikube` |

The agent discovers the app, creates/updates `k8s/` manifests, deploys, verifies with curl, and writes the report.

---

## Prerequisites

| Tool | Purpose | Check |
| ---- | ------- | ----- |
| [Docker](https://docs.docker.com/get-docker/) | Build images | `docker info` |
| [kind](https://kind.sigs.k8s.io/) | Local K8s cluster | `kind version` |
| [kubectl](https://kubernetes.io/docs/tasks/tools/) | Apply manifests | `kubectl version --client` |

Optional: [minikube](https://minikube.sigs.k8s.io/) instead of kind.

---

## Up — Deploy the stack

Run from the **repository root** (or adjust paths):

```bash
cd Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service

# 1. Create local cluster (skip if d4-b4 already exists)
kind create cluster --name d4-b4

# 2. Build container image
docker build -t b4-transaction-api:local .

# 3. Load image into kind (required — kind cannot pull local images)
kind load docker-image b4-transaction-api:local --name d4-b4

# 4. Apply Kubernetes manifests
kubectl apply -f k8s/

# If configmap/deployment fail with "namespace b4 not found", re-run:
kubectl apply -f k8s/

# 5. Wait for rollout
kubectl rollout status deployment/b4-transaction-api -n b4

# 6. Confirm pods and service
kubectl get pods,svc -n b4
```

### Expected output (up)

| Check | Expected |
| ----- | -------- |
| kind cluster | `Set kubectl context to "kind-d4-b4"` |
| Docker build | `Successfully tagged b4-transaction-api:local` |
| kubectl apply | `deployment.apps/b4-transaction-api created` |
| Rollout | `successfully rolled out` |
| Pods | 2/2 **Running**, **Ready** |
| Service | `b4-transaction-api` · ClusterIP · **8000/TCP** |

---

## Down — Teardown

### Remove app only (keep cluster)

```bash
cd Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service
kubectl delete -f k8s/
```

### Full teardown (app + cluster)

```bash
kubectl delete -f k8s/
kind delete cluster --name d4-b4
```

Verify cluster gone:

```bash
kind get clusters
# Expected: No kind clusters found.
```

---

## Test after deployment

The Service is **ClusterIP** — not reachable on your Mac until you port-forward.

### Step 1 — Port forward (Terminal 1, keep open)

```bash
kubectl port-forward svc/b4-transaction-api 18080:8000 -n b4
```

| Port | Where |
| ---- | ----- |
| **8000** | Inside Kubernetes (pod / service) |
| **18080** | On your Mac (use this for curl/browser) |

> Use **18080** if port **8000** is already in use locally (`lsof -i :8000`).

### Step 2 — Health check (Terminal 2)

```bash
curl http://127.0.0.1:18080/health
```

**Expected:**

```json
{"status":"ok"}
```

### Step 3 — API smoke tests

```bash
# Balance
curl http://127.0.0.1:18080/balance

# Create transaction
curl -X POST http://127.0.0.1:18080/transactions \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "type": "credit"}'

# List transactions
curl http://127.0.0.1:18080/transactions
```

**Expected balance response:**

```json
{"balance":100.0,"transaction_count":1}
```

### Step 4 — Swagger UI

Open in browser (with port-forward running):

```
http://127.0.0.1:18080/docs
```

---

## Run locally (without Kubernetes)

B4 can also run directly with uvicorn — **separate from K8s**, separate in-memory data:

```bash
cd Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service
source .venv/bin/activate
pip install -r requirements.txt

# Use 8001 if 8000 is busy
uvicorn app.main:app --reload --port 8001

curl http://127.0.0.1:8001/health
```

| Mode | URL | Data store |
| ---- | --- | ---------- |
| Local uvicorn | `http://127.0.0.1:8001` | In-memory (local process) |
| Kubernetes | `http://127.0.0.1:18080` (port-forward) | In-memory (pod) |

POST/GET requests to the API **do not** change Terraform, Docker Compose, CI, or K8s manifests.

---

## kubectl quick reference

```bash
# Status
kubectl get pods -n b4
kubectl get svc -n b4
kubectl get endpoints -n b4

# Logs
kubectl logs -n b4 -l app.kubernetes.io/name=b4-transaction-api

# Describe (troubleshooting)
kubectl describe pod -n b4 -l app.kubernetes.io/name=b4-transaction-api

# Restart deployment
kubectl rollout restart deployment/b4-transaction-api -n b4

# Validate manifests (dry-run)
kubectl apply --dry-run=client -f k8s/
```

---

## Troubleshooting

| Issue | Fix |
| ----- | --- |
| `namespace "b4" not found` on first apply | Run `kubectl apply -f k8s/` again |
| Pods `ImagePullBackOff` | Run `kind load docker-image b4-transaction-api:local --name d4-b4` |
| `curl` returns wrong response | Confirm port-forward is running; use **18080**, not 8000 |
| Port 8000 in use on Mac | Port-forward to `18080:8000` instead |
| `kind create cluster` fails — name in use | `kind delete cluster --name d4-b4` then recreate |
| Transactions disappear after pod restart | Expected — B4 uses in-memory storage |

---

## Manifest inventory

Located in `Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service/k8s/`:

| File | Kind | Purpose |
| ---- | ---- | ------- |
| `namespace.yaml` | Namespace | `b4` isolation |
| `configmap.yaml` | ConfigMap | Non-secret config |
| `deployment.yaml` | Deployment | 2 replicas, `/health` probes |
| `service.yaml` | Service | ClusterIP port 8000 |
| `README.md` | Docs | App-specific k8s notes |

---

## Documentation

| Document | Description |
| -------- | ----------- |
| [`agent.md`](agent.md) | D4 agent spec and full workflow |
| [`docs/kubernetes-deployment-report.md`](docs/kubernetes-deployment-report.md) | Agent verification report |
| [`docs/run-status.md`](docs/run-status.md) | Local deploy + curl verification evidence |
| [B4 k8s/README.md](../Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service/k8s/README.md) | Target app manifest guide |

---

## One-page cheat sheet

```bash
# UP
cd Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service
kind create cluster --name d4-b4
docker build -t b4-transaction-api:local .
kind load docker-image b4-transaction-api:local --name d4-b4
kubectl apply -f k8s/ && kubectl apply -f k8s/
kubectl rollout status deployment/b4-transaction-api -n b4

# TEST
kubectl port-forward svc/b4-transaction-api 18080:8000 -n b4   # Terminal 1
curl http://127.0.0.1:18080/health                             # Terminal 2

# DOWN
kubectl delete -f k8s/
kind delete cluster --name d4-b4
```
