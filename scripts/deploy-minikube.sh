#!/usr/bin/env bash
# ==============================================================================
# Minikube Automated Deployment Script (Bash / Linux / macOS)
# ==============================================================================

set -e

echo "=========================================================="
echo " CloudSecure Vault - Automated Minikube Kubernetes Deploy "
echo "=========================================================="

echo -e "\n[1/6] Checking Minikube status..."
if ! minikube status | grep -q "Running"; then
  echo "Starting Minikube with Calico CNI..."
  minikube start --network-plugin=cni --cni=calico
else
  echo "Minikube is running."
fi

echo -e "\n[2/6] Pointing Docker CLI to Minikube's Docker daemon..."
eval $(minikube -p minikube docker-env)

echo -e "\n[3/6] Building production Docker image (cloud-vault-app:v1)..."
docker build -t cloud-vault-app:v1 .

echo -e "\n[4/6] Applying Kubernetes manifests..."
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/networkpolicy.yaml

echo -e "\n[5/6] Waiting for rollout to complete..."
kubectl rollout status deployment/cloud-vault-deployment -n cloud-vault --timeout=120s

echo -e "\n[6/6] Cluster pods status:"
kubectl get pods -n cloud-vault -o wide

echo "=========================================================="
echo " DEPLOYMENT COMPLETE! "
echo "=========================================================="
echo "Access the app using:"
echo "   minikube service cloud-vault-service -n cloud-vault"
