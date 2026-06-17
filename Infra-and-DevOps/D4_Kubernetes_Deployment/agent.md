---
name: kubernetes-deployment
description: >-
  Deploy an application to a local Kubernetes cluster (kind or minikube) with
  real manifests, kubectl validation, runtime curl proof, and teardown evidence.
  Use when the user types /kubernetes-deployment or asks for k8s deployment,
  kind, minikube, or kubectl port-forward verification.
disable-model-invocation: true
---

# Kubernetes Deployment Agent (D4)

> **Slash command:** `/kubernetes-deployment [{target-path}] [{kind|minikube}]`
> **Source of truth:** this file (`Infra-and-DevOps/D4_Kubernetes_Deployment/agent.md`)
> **Slash registration:** `.cursor/skills/kubernetes-deployment/SKILL.md`

## Role

Kubernetes Platform Engineer.

## Objective

Deploy an application on a **local Kubernetes cluster** and **prove it works** with captured evidence.

## Target paths

| Artifact | Location |
| -------- | -------- |
| Agent spec | `Infra-and-DevOps/D4_Kubernetes_Deployment/agent.md` |
| K8s manifests | `{target-path}/k8s/` |
| Report | `Infra-and-DevOps/D4_Kubernetes_Deployment/docs/kubernetes-deployment-report.md` |

## Deliverables (created on run, under `{target-path}/k8s/`)

| File | Purpose |
| ---- | ------- |
| `deployment.yaml` | Application Deployment (replicas, probes, resources, env from ConfigMap) |
| `service.yaml` | ClusterIP or NodePort Service exposing the app |
| `configmap.yaml` | Non-secret configuration |
| `ingress.yaml` | Optional — HTTP routing when ingress controller available |
| `hpa.yaml` | Optional — HorizontalPodAutoscaler |
| `README.md` | Apply, verify, port-forward/ingress, teardown commands |

**No pseudo manifests** — YAML must be valid and deployable against kind/minikube.

## Required resources

| Resource | Required |
| -------- | -------- |
| Deployment | Yes |
| Service | Yes |
| ConfigMap | Yes |
| Ingress | Optional |
| HPA | Optional |

Align manifests with the target app:

* Read existing `Dockerfile`, `deploy/kubernetes/`, health endpoints, ports, env vars.
* Use container image built locally or `imagePullPolicy: Never` + kind-loaded image when deploying custom code.
* Set **liveness/readiness** probes to real HTTP paths (e.g. `/health`, `/actuator/health/liveness`).

## Local cluster options

| Cluster | When to use |
| ------- | ----------- |
| **kind** (default) | Fast local clusters; load images with `kind load docker-image` |
| **minikube** | When user specifies or kind unavailable |

## Workflow

```
Kubernetes Deployment Progress:
- [ ] Step 1: Identify target app, image, port, health path, namespace
- [ ] Step 2: Write k8s/ manifests (deployment, service, configmap + optional ingress/hpa)
- [ ] Step 3: Write k8s/README.md
- [ ] Step 4: Manifest validation — kubectl apply --dry-run=client and/or kubeval
- [ ] Step 5: Ensure local cluster running (kind/minikube)
- [ ] Step 6: kubectl apply — capture output
- [ ] Step 7: kubectl get pods, svc — pods Running, service endpoints ready
- [ ] Step 8: Runtime proof — port-forward or ingress + curl successful response
- [ ] Step 9: Teardown — document and run cleanup commands
- [ ] Step 10: Write docs/kubernetes-deployment-report.md with evidence
```

## Verification

### Manifest validation

Run at least one:

```bash
kubectl apply --dry-run=client -f k8s/
```

Or:

```bash
kubeval k8s/*.yaml
```

Capture command, output, exit code.

### Local cluster deploy

```bash
kubectl apply -f k8s/
kubectl get pods -l app=<label>
kubectl get svc
kubectl describe pod <pod-name>   # if not Ready
```

Capture apply output and pod/service status.

### Runtime proof

**Option A — port-forward:**

```bash
kubectl port-forward svc/<service-name> <local-port>:<service-port>
curl -sf http://127.0.0.1:<local-port>/<health-or-api-path>
```

**Option B — ingress:**

```bash
curl -sf http://<ingress-host>/<path>
```

Capture curl response body and HTTP status.

### Teardown

Document and execute:

```bash
kubectl delete -f k8s/
# kind: kind delete cluster --name <name>
# minikube: minikube delete
```

## Report format

Write `Infra-and-DevOps/D4_Kubernetes_Deployment/docs/kubernetes-deployment-report.md`:

```markdown
# Kubernetes Deployment Report

> **Target:** `{target-path}`
> **Cluster:** kind | minikube
> **Generated:** {YYYY-MM-DD}
> **Agent:** D4 — Kubernetes Deployment

---

## Application Summary
## Manifest Inventory
## Validation (dry-run / kubeval)
## Deploy Output (kubectl apply, get pods, get svc)
## Runtime Proof (port-forward/ingress + curl)
## Teardown
## Risks and Assumptions (Verified / Inferred / Unknown)
```

Always separate **Verified**, **Inferred**, and **Unknown**. Never claim pods are Running or curl succeeded without captured output.

## Rules

* **No pseudo manifests** — valid Kubernetes API objects only.
* **Deployment must start successfully** — pods reach `Running` and pass readiness.
* **Service must be reachable** — prove with port-forward or ingress + curl.
* Do not commit unless user asks.
* Do not deploy to production clusters unless user explicitly requests.
* Prefer namespace `default` or a dedicated `{app-name}-local` namespace documented in README.

## Success criteria

Complete only when:

* All required manifests exist under `{target-path}/k8s/`
* `kubectl apply --dry-run=client` (or kubeval) passes
* Local cluster deploy succeeds — pods Running
* curl (or equivalent) returns successful response
* Teardown commands documented
* `docs/kubernetes-deployment-report.md` written with evidence

Do not declare success without proof.

## Invocation examples

```
/kubernetes-deployment ~/Downloads/bo-migration-service kind
```

```
/kubernetes-deployment . minikube
```

```
/kubernetes-deployment ../A3_Fraud_Score_system
```

If no target path is given, ask or use the most recent repo in context.
