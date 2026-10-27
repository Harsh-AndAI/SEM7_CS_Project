# ==============================================================================
# Minikube Automated Deployment Script (PowerShell)
# ==============================================================================

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " CloudSecure Vault - Automated Minikube Kubernetes Deploy " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Check Minikube Status
Write-Host "`n[1/6] Checking Minikube status..." -ForegroundColor Yellow
$minikubeStatus = minikube status --format "{{.Host}}" 2>$null
if ($minikubeStatus -ne "Running") {
    Write-Host "Starting Minikube with Calico CNI (for Network Policies)..." -ForegroundColor Green
    minikube start --network-plugin=cni --cni=calico
} else {
    Write-Host "Minikube is running." -ForegroundColor Green
}

# 2. Point Docker CLI to Minikube's internal Docker Daemon
Write-Host "`n[2/6] Pointing Docker CLI to Minikube's internal Docker daemon..." -ForegroundColor Yellow
& minikube -p minikube docker-env --shell powershell | Invoke-Expression

# 3. Build Docker container image inside Minikube
Write-Host "`n[3/6] Building production Docker container image (cloud-vault-app:v1)..." -ForegroundColor Yellow
docker build -t cloud-vault-app:v1 .

if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker build failed. Please resolve build errors." -ForegroundColor Red
    exit 1
}
Write-Host "Container image built successfully in Minikube's Docker daemon." -ForegroundColor Green

# 4. Apply Kubernetes Manifests
Write-Host "`n[4/6] Applying Kubernetes manifests..." -ForegroundColor Yellow
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/networkpolicy.yaml

# 5. Wait for deployment rollout
Write-Host "`n[5/6] Waiting for CloudSecure Vault pods to become ready..." -ForegroundColor Yellow
kubectl rollout status deployment/cloud-vault-deployment -n cloud-vault --timeout=120s

# 6. Expose and Display Service URL
Write-Host "`n[6/6] Getting live Service URL..." -ForegroundColor Yellow
kubectl get pods -n cloud-vault -o wide
Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host " DEPLOYMENT SUCCESSFUL! " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "Run the following command to open the application in your browser:" -ForegroundColor Cyan
Write-Host "   minikube service cloud-vault-service -n cloud-vault" -ForegroundColor White
Write-Host "Or get the direct URL with:" -ForegroundColor Cyan
Write-Host "   minikube service cloud-vault-service -n cloud-vault --url" -ForegroundColor White
