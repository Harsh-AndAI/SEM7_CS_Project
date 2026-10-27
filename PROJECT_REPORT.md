# College Project & Practical Examination Report

## Project Title: CloudSecure Vault — Enterprise Incident & Compliance Record Manager
**Course:** Cloud Computing / Cloud Security Practicals (SEM 7)  
**Submission Deadline:** On or before 30th September 2026  
**Technologies:** Next.js 15, TypeScript, IBM Cloud App ID, IBM Cloudant (NoSQL CouchDB), Docker, Kubernetes (Minikube), Calico CNI, Aqua Security Trivy  

---

### Executive Summary & Problem Definition
In modern hybrid cloud infrastructures, enterprises face strict regulatory compliance frameworks (GDPR, HIPAA, ISO/IEC 27001, SOC 2 Type II). Managing security incident reports, data breach investigations, and compliance audit logs requires a tamper-evident, zero-trust cloud system. Traditional monolithic systems suffer from lateral network attack vulnerabilities, weak identity boundaries, and lack of dynamic scalability.

**CloudSecure Vault** resolves these issues through a cloud-native, microservices-ready architecture:
1. **Dynamic Content & Data Persistence:** Employs **IBM Cloudant**, a distributed NoSQL document database based on Apache CouchDB, providing ACID properties, optimistic concurrency control via document revisions (`_rev`), and data-at-rest encryption.
2. **Cloud Security & Identity Federation:** Integrates **IBM Cloud App ID** providing OpenID Connect (OIDC) and OAuth 2.0 authorization code flow, Role-Based Access Control (RBAC), and cryptographic JWT validation.
3. **Orchestration & High Availability:** Containerized with an optimized multi-stage Alpine Docker image and deployed across a **Kubernetes (Minikube)** cluster with self-healing liveness and readiness health probes.
4. **Zero-Trust Network Isolation:** Implements Kubernetes **NetworkPolicies** using the Calico CNI plugin to enforce default-deny egress and ingress rules, mitigating lateral attacker movement.
5. **Vulnerability Assessment:** Hardened through automated **Aqua Security Trivy** vulnerability scanning against the National Vulnerability Database (NVD).

---

### Architectural Diagram

```
+-----------------------------------------------------------------------------------+
|                                  USER BROWSER                                     |
|                   (Next.js 15 Reactive Glassmorphism UI)                          |
+------------------------------------------+----------------------------------------+
                                           |
                                  HTTPS / TCP 30080
                                           |
                                           v
+-----------------------------------------------------------------------------------+
|                        KUBERNETES CLUSTER (MINIKUBE)                              |
|                                                                                   |
|  [ Namespace: cloud-vault ]                                                       |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                 Calico NetworkPolicy (cloud-vault-network-policy)           |  |
|  |  * Ingress: Inbound traffic restricted to port 3000                        |  |
|  |  * Egress: Allowed strictly to kube-dns (UDP 53) and HTTPS Public APIs (443)|  |
|  |  * Blocked: All lateral inter-pod traffic to unapproved namespaces          |  |
|  +---------------------------------------+-------------------------------------+  |
|                                          |                                        |
|  +---------------------------------------v-------------------------------------+  |
|  |                   NodePort Service (cloud-vault-service)                    |  |
|  |                   Port: 3000 -> NodePort: 30080                             |  |
|  +---------------------------------------+-------------------------------------+  |
|                                          |                                        |
|  +---------------------------------------v-------------------------------------+  |
|  |            Deployment: cloud-vault-deployment (2 Replicas)                  |  |
|  |                                                                             |  |
|  |  +---------------------------+       +---------------------------+          |  |
|  |  | Pod 1: cloud-vault-app    |       | Pod 2: cloud-vault-app    |          |  |
|  |  | Container: Node 22 Alpine |       | Container: Node 22 Alpine |          |  |
|  |  | User: nextjs (UID 10001)  |       | User: nextjs (UID 10001)  |          |  |
|  |  | Health: /api/health       |       | Health: /api/health       |          |  |
|  |  +-------------+-------------+       +-------------+-------------+          |  |
|  +----------------|-----------------------------------|------------------------+  |
+-------------------|-----------------------------------|---------------------------+
                    |                                   |
         OIDC Auth / Token Exchange          HTTPS REST SDK (TLS 1.3)
                    |                                   |
                    v                                   v
+---------------------------------------+   +---------------------------------------+
|          IBM CLOUD APP ID             |   |          IBM CLOUDANT NoSQL           |
|  * OAuth 2.0 / OIDC Authorization     |   |  * Managed Apache CouchDB             |
|  * Token Endpoint: /oauth/v4/{tenant} |   |  * Optimistic Concurrency (_rev)      |
|  * JWKS Verification Keys             |   |  * Document Storage & Mango Indexing  |
|  * RBAC: Admin, Analyst, Auditor      |   |  * IAM Bearer Token & TLS Encryption  |
+---------------------------------------+   +---------------------------------------+
```

---

### Implementation Details Per Guideline

#### Guideline 2: Programming Language & Environment
- **Framework:** Next.js 15 (App Router, Server-side API route handlers).
- **Language:** TypeScript 5.7 (strict type safety enabled).
- **UI Engine:** React 19 with custom Vanilla CSS Tokens and Glassmorphism Design System (avoiding heavy CSS framework bloat).
- **Icons & Visuals:** `lucide-react` modern cybernetic iconography.

#### Guideline 3: Database Connectivity & CRUD Operations
- **Database:** IBM Cloudant (distributed NoSQL document database).
- **SDK:** Official `@ibm-cloud/cloudant` with `ibm-cloud-sdk-core` IAM authentication.
- **CRUD Operations Demonstrated:**
  - **Create (`POST /api/records`):** Inserts structured security records (title, severity, classification, affected systems, tags, remediation notes, reporter metadata) into the `cloud_vault_records` database.
  - **Read (`GET /api/records`):** Queries database records using CouchDB `postAllDocs` / Mango selectors with real-time client-side search and filtering by severity, status, and category.
  - **Update (`PUT /api/records/[id]`):** Implements optimistic concurrency control by verifying and updating the CouchDB document revision (`_rev`), preventing conflicting writes.
  - **Delete (`DELETE /api/records/[id]`):** Deletes documents using document ID and `_rev` with role-based authorization check.
- **Dynamic Content Management:** Live statistics dashboard recalculating threat distributions, open investigations, and affected cloud components.

#### Guideline 4: Git Version Control
- Project initialized as a Git repository (`.git`).
- Structured commit history documenting architectural stages.
- Comprehensive `.gitignore` protecting secrets, `.env*.local`, node_modules, and build outputs.

#### Guideline 5: Kubernetes (Minikube) Deployment
- **Deployment (`k8s/deployment.yaml`):** 2 replicas with RollingUpdate deployment strategy (`maxSurge: 1`, `maxUnavailable: 0`).
- **Service (`k8s/service.yaml`):** Exposes application via `NodePort 30080`.
- **ConfigMap (`k8s/configmap.yaml`):** Centralizes application URLs, region strings, and environment modes.
- **Secrets (`k8s/secret.yaml`):** Segregates sensitive IBM App ID credentials and IBM Cloudant API keys from code.
- **Self-Healing Probes:**
  - `livenessProbe`: Verifies HTTP 200 on `/api/health` every 20 seconds.
  - `readinessProbe`: Checks container responsiveness before routing traffic.

#### Guideline 6: Storage Security & Application Authentication
1. **IBM App ID (Application Authentication):**
   - Implements full OpenID Connect authorization code flow.
   - User tokens are exchanged and verified against IBM App ID JWKS endpoints.
   - Encrypted HttpOnly session cookies protect against XSS and session hijacking.
   - Role-Based Access Control (RBAC):
     - `Admin`: Full permissions (Create, Read, Update, Delete).
     - `Security Analyst`: Create, Read, Update permissions.
     - `Compliance Auditor`: Read-only audit access (Delete forbidden with HTTP 403).
2. **Database & Storage Security:**
   - Database operations require IBM Cloud IAM Bearer tokens transmitted over TLS 1.3.
   - Input sanitization layer strips malicious script tags and NoSQL injection patterns.
   - Least privilege container execution (UID 10001 `nextjs`).

#### Guideline 7: Network Policies
- Manifest: `k8s/networkpolicy.yaml` enforced via Calico CNI.
- **Ingress Policy:** Only incoming TCP traffic on port 3000 is permitted.
- **Egress Policy:**
  - Port 53 (UDP/TCP) to `kube-system` CoreDNS for domain resolution.
  - Port 443 (TCP) for outbound HTTPS traffic to IBM Cloud endpoints (`*.appid.cloud.ibm.com`, `*.cloudantnosqldb.appdomain.cloud`).
  - All lateral inter-pod traffic to unapproved internal VPC CIDRs is denied.

#### Guideline 8: Image Vulnerability Scanning
- Tool: **Aqua Security Trivy** (containerized scanner).
- Target: `cloud-vault-app:v1`.
- Strategy: Multi-stage Docker build discarding npm cache, source files, and devDependencies, reducing image size to ~120MB and mitigating OS-level CVEs.

---

### Step-by-Step Live Demonstration Script

When demonstrating the project to professors and examiners:

1. **Demonstrate Web Application & UI:**
   - Open browser to `http://localhost:3000` (or `http://<minikube-ip>:30080`).
   - Showcase the Glassmorphism Cyber Dashboard, Cloud Services status badges, and metrics cards.
2. **Demonstrate Dynamic CRUD Operations:**
   - Click **"New Security Record"** -> Fill out title, severity (CRITICAL), classification (RESTRICTED), tags, and affected systems -> Click Save.
   - Show the newly created record appearing instantly in the table.
   - Click the **Eye icon (Inspect)** -> Show the raw CouchDB JSON with generated `_id` and `_rev` metadata!
   - Click the **Edit icon** -> Change status to `MITIGATED` and update remediation plan -> Save. Note that `_rev` increments (e.g. from `1-...` to `2-...`).
   - Click the **Trash icon** -> Demonstrate safe deletion from the database.
3. **Demonstrate Authentication & RBAC:**
   - Click the user identity badge in the top right.
   - Switch role to **Compliance Auditor (Read-Only)**.
   - Note that the delete action is disabled/forbidden, proving Role-Based Access Control!
   - Switch back to **Security Admin** or click **Login via IBM App ID** to show live OIDC authentication.
4. **Demonstrate Kubernetes & Minikube Cluster:**
   - In terminal, run: `kubectl get all -n cloud-vault`
   - Show the 2 running pods, the Deployment, and the NodePort Service.
   - Run: `kubectl describe networkpolicy cloud-vault-network-policy -n cloud-vault`
   - Explain how Calico enforces Zero-Trust ingress and egress filtering.
5. **Demonstrate Image Vulnerability Scan:**
   - Run: `powershell .\scripts\scan-image.ps1`
   - Show Trivy scanning the container layers and reporting 0 High/Critical vulnerabilities.
