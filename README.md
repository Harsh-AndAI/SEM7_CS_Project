# CloudSecure Vault: Enterprise Incident & Compliance Record Manager

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![IBM Cloud](https://img.shields.io/badge/IBM%20Cloud-App%20ID%20%7C%20Cloudant-0f62fe?style=flat-square&logo=ibm)](https://cloud.ibm.com)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Minikube-326ce5?style=flat-square&logo=kubernetes)](https://kubernetes.io/)
[![Docker](https://img.shields.io/badge/Docker-Multi--stage%20Alpine-2496ed?style=flat-square&logo=docker)](https://www.docker.com/)
[![Security](https://img.shields.io/badge/Security-Trivy%20Scanned%20%7C%20Calico%20NetPol-10b981?style=flat-square)](https://aquasecurity.github.io/trivy/)

A cloud-native Security Incident & Compliance Document Management System designed for enterprise zero-trust environments. Built with **Next.js 15**, authenticated via **IBM App ID (OIDC)**, stored in **IBM Cloudant (NoSQL CouchDB)**, containerized with **Docker**, and deployed on a **Kubernetes (Minikube)** cluster with strict **Calico Network Policies** and **Trivy Image Vulnerability Scanning**.

---

## 📋 College Assignment Guideline Compliance

| Guideline | Requirement | Implementation in Project |
| :--- | :--- | :--- |
| **2** | Programming Language & Framework | **Next.js 15** (TypeScript, React 19, Node.js runtime) |
| **3** | Database Connectivity & CRUD | **IBM Cloudant** NoSQL (CouchDB) via official SDK (`@ibm-cloud/cloudant`) with full Create, Read, Update, Delete |
| **4** | Git Repository Versioning | Initialized Git repository, semantic commits, `.gitignore` for secrets |
| **5** | Kubernetes Cluster Deployment | Production manifests in `k8s/` deployed on **Minikube** with multi-replica Deployment, Service, ConfigMap, Secrets |
| **6** | DB Security & Cloud Authentication | **IBM App ID** (OAuth 2.0 / OIDC), IAM Bearer tokens, input sanitization, non-root container |
| **7** | Network Policies | Calico Zero-Trust **NetworkPolicy** in `k8s/networkpolicy.yaml` blocking unauthorized inter-pod traffic |
| **8** | Vulnerability Scanning | **Aqua Security Trivy** automated scanning script in `scripts/scan-image.ps1` |

---

## 🚀 Quickstart: Running Locally

### 1. Install Dependencies & Start Dev Server
```bash
npm install
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

> **Note:** The application includes an instant **Demo / Simulation Mode** out-of-the-box, allowing full CRUD operations, role switching (Admin, SOC Analyst, Auditor), and UI exploration before adding live IBM Cloud keys.

---

## 🔑 Configuring Live IBM Cloud Credentials

Create a `.env.local` file (copied from `.env.example`) and fill in your IBM Cloud credentials:

```bash
cp .env.example .env.local
```

### 1. IBM App ID Configuration
1. Log in to [IBM Cloud Console](https://cloud.ibm.com).
2. Go to **Resource list** > **Services** > Select your **App ID** instance.
3. In App ID dashboard, go to **Applications** > **Add application** (Regular web application).
4. View credentials and paste into `.env.local`:
   ```env
   IBM_APPID_CLIENT_ID="<your-client-id>"
   IBM_APPID_SECRET="<your-secret>"
   IBM_APPID_TENANT_ID="<your-tenant-id>"
   IBM_APPID_OAUTH_SERVER_URL="https://<region>.appid.cloud.ibm.com/oauth/v4/<tenant-id>"
   ```
5. In App ID > **Manage Authentication** > **Identity Providers**, enable Cloud Directory or Google/Email.
6. Under **Authentication Settings** > **Add redirect URLs**, add:
   `http://localhost:3000/api/auth/callback` and `http://localhost:30080/api/auth/callback`

### 2. IBM Cloudant Configuration
1. Go to **Resource list** > **Databases** > Select your **Cloudant** instance.
2. Go to **Service credentials** > **New credential** (Manager role).
3. Copy `apikey` and `url` into `.env.local`:
   ```env
   IBM_CLOUDANT_APIKEY="<your-cloudant-api-key>"
   IBM_CLOUDANT_URL="https://<account>.cloudantnosqldb.appdomain.cloud"
   IBM_CLOUDANT_DATABASE="cloud_vault_records"
   ```

---

## ☸️ Minikube Kubernetes Deployment

We provide an automated deployment script for Windows PowerShell and Linux/macOS.

### Windows (PowerShell)
```powershell
.\scripts\deploy-minikube.ps1
```

### Linux / macOS / WSL
```bash
chmod +x ./scripts/deploy-minikube.sh
./scripts/deploy-minikube.sh
```

### Manual Step-by-Step Deployment:
```bash
# 1. Start Minikube with Calico CNI enabled (for Network Policies)
minikube start --network-plugin=cni --cni=calico

# 2. Point Docker CLI to Minikube's Docker daemon
# Windows PowerShell:
& minikube -p minikube docker-env --shell powershell | Invoke-Expression
# Linux / macOS:
eval $(minikube -p minikube docker-env)

# 3. Build container inside Minikube
docker build -t cloud-vault-app:v1 .

# 4. Apply Kubernetes Manifests
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/networkpolicy.yaml

# 5. Access the live application
minikube service cloud-vault-service -n cloud-vault
```

---

## 🛡️ Image Vulnerability Scanning (Guideline 8)

Run Aqua Security's Trivy vulnerability scanner on the production Docker image:

### Windows PowerShell:
```powershell
.\scripts\scan-image.ps1
```

### Linux / macOS:
```bash
chmod +x ./scripts/scan-image.sh
./scripts/scan-image.sh
```

Or run directly with Docker:
```bash
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image --severity HIGH,CRITICAL cloud-vault-app:v1
```

---

## 📂 Project Architecture

```
Prject/
├── .env.example              # Template for IBM credentials
├── .env.local                # Local environment secrets (not in git)
├── Dockerfile                # Multi-stage hardened Alpine container
├── docker-compose.yml        # Docker Compose configuration
├── PROJECT_REPORT.md         # Comprehensive viva & project submission report
├── k8s/
│   ├── namespace.yaml        # cloud-vault namespace
│   ├── configmap.yaml        # App URLs and environment config
│   ├── secret.yaml           # IBM Cloud credentials & session keys
│   ├── deployment.yaml       # Multi-replica Deployment with health probes
│   ├── service.yaml          # NodePort service on port 30080
│   └── networkpolicy.yaml    # Calico Zero-Trust Ingress/Egress policy
├── scripts/
│   ├── deploy-minikube.ps1   # PowerShell automated deploy
│   ├── deploy-minikube.sh    # Bash automated deploy
│   ├── scan-image.ps1        # PowerShell Trivy vulnerability scanner
│   └── scan-image.sh         # Bash Trivy vulnerability scanner
└── src/
    ├── app/                  # Next.js App Router & REST API Routes
    │   ├── api/auth/         # IBM App ID OIDC login/callback/logout
    │   ├── api/records/      # IBM Cloudant CRUD endpoints
    │   ├── api/health/       # K8s liveness & readiness probe
    │   └── api/status/       # Cloud services & cluster monitor
    ├── components/           # UI design system & modals
    └── lib/                  # IBM SDK clients & session crypto
```
