# B4 Transaction API — Kubernetes Manifests

Deploy the FastAPI Transaction API to a local **kind** cluster.

| Resource | File | Purpose |
| -------- | ---- | ------- |
| Namespace | `namespace.yaml` | Isolated `b4` namespace |
| ConfigMap | `configmap.yaml` | Non-secret app configuration |
| Deployment | `deployment.yaml` | 2 replicas, probes on `/health` |
| Service | `service.yaml` | ClusterIP on port 8000 |

## Prerequisites

- Docker (Colima or Docker Desktop)
- [kind](https://kind.sigs.k8s.io/)
- kubectl

## Deploy

```bash
cd Basic-repo-reader-and-builder/B4_FastAPI_greenfield_service

kind create cluster --name d4-b4

docker build -t b4-transaction-api:local .
kind load docker-image b4-transaction-api:local --name d4-b4

kubectl apply -f k8s/
# If configmap/deployment fail with "namespace b4 not found", re-run:
kubectl apply -f k8s/
kubectl rollout status deployment/b4-transaction-api -n b4
kubectl get pods,svc,endpoints -n b4
```

## Verify

```bash
kubectl port-forward svc/b4-transaction-api 18080:8000 -n b4
curl http://127.0.0.1:18080/health
```

Expected health response: `{"status":"ok"}`

Local verification: [local-testing.md](../local-testing.md) · [validation-results.md](../validation-results.md) · [STATUS.md](../STATUS.md)

## Teardown

```bash
kubectl delete -f k8s/
kind delete cluster --name d4-b4
```

## Dry-run validation

```bash
kubectl apply --dry-run=client -f k8s/
```
