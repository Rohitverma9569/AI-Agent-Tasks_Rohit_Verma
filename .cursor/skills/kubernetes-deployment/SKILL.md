---
name: kubernetes-deployment
description: >-
  Deploy an app to local Kubernetes (kind or minikube) with real manifests,
  kubectl dry-run validation, pod/service proof, and curl via port-forward or
  ingress. Use when the user types /kubernetes-deployment or asks for k8s local
  deploy with runtime verification.
disable-model-invocation: true
---

# Kubernetes Deployment (slash command entry)

Read and follow **`Infra-and-DevOps/D4_Kubernetes_Deployment/agent.md`** in full.

Create manifests under `{target-path}/k8s/`. Validate with `kubectl apply --dry-run=client` or kubeval. Deploy to kind or minikube. Prove reachability with port-forward/ingress + curl. Capture teardown steps.

Write the report to **`Infra-and-DevOps/D4_Kubernetes_Deployment/docs/kubernetes-deployment-report.md`**.

Do not commit unless the user asks.
