import { SecurityRecord } from './types';

// In-memory persistent mock storage for development / demo mode
let records: SecurityRecord[] = [
  {
    _id: 'sec-doc-001',
    _rev: '1-a1b2c3d4e5f6',
    id: 'sec-doc-001',
    type: 'security_incident',
    title: 'Kubernetes Ingress Controller Suspicious Rate Spike',
    description: 'Anomalous burst of HTTP 401/403 requests detected targeting internal OAuth callback endpoints. Ingress rate-limiter engaged.',
    severity: 'HIGH',
    classification: 'CONFIDENTIAL',
    status: 'INVESTIGATING',
    affectedSystems: ['k8s-ingress-nginx', 'auth-service', 'api-gateway'],
    tags: ['ddos', 'oauth2', 'rate-limit', 'ibm-appid'],
    reportedBy: {
      name: 'Alex Turner',
      email: 'alex.soc@cloudvault.ibm.internal',
      role: 'SOC Analyst',
    },
    remediationPlan: 'Enable Calico network policy egress restrictions and enforce IP whitelisting on public LB.',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    _id: 'sec-doc-002',
    _rev: '1-f7e8d9c0b1a2',
    id: 'sec-doc-002',
    type: 'compliance_document',
    title: 'ISO 27001 Cryptographic Key Rotation Audit',
    description: 'Quarterly review of IBM Cloud Key Protect HSM root keys and database encryption at rest verification for IBM Cloudant.',
    severity: 'LOW',
    classification: 'RESTRICTED',
    status: 'RESOLVED',
    affectedSystems: ['ibm-cloudant-db', 'key-protect-hsm', 'tls-termination'],
    tags: ['iso-27001', 'audit', 'cloudant', 'encryption'],
    reportedBy: {
      name: 'Elena Rostova',
      email: 'elena.auditor@cloudvault.ibm.internal',
      role: 'Lead Auditor',
    },
    remediationPlan: 'All data partitions encrypted via FIPS 140-2 Level 3 HSM. Audit approved with zero non-conformities.',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
  },
  {
    _id: 'sec-doc-003',
    _rev: '1-9876543210ab',
    id: 'sec-doc-003',
    type: 'security_incident',
    title: 'Unauthorized Pod Communication Attempt Detected',
    description: 'Minikube NetworkPolicy intercepted unauthorized east-west inter-pod traffic from untrusted namespace attempting port 5984.',
    severity: 'CRITICAL',
    classification: 'RESTRICTED',
    status: 'MITIGATED',
    affectedSystems: ['k8s-minikube-worker-01', 'cloudant-proxy-pod'],
    tags: ['network-policy', 'zero-trust', 'cve-prevention', 'isolation'],
    reportedBy: {
      name: 'Marcus Chen',
      email: 'marcus.ciso@cloudvault.ibm.internal',
      role: 'Security Admin',
    },
    remediationPlan: 'Default-deny network policy active. Pod quarantined and security scan initiated with Trivy.',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

export const MockDatabase = {
  async getAll(): Promise<SecurityRecord[]> {
    return [...records].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getById(id: string): Promise<SecurityRecord | null> {
    const item = records.find((r) => r._id === id || r.id === id);
    return item ? { ...item } : null;
  },

  async create(record: Omit<SecurityRecord, '_id' | '_rev' | 'id' | 'createdAt' | 'updatedAt'>): Promise<SecurityRecord> {
    const now = new Date().toISOString();
    const id = `sec-doc-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const newDoc: SecurityRecord = {
      ...record,
      _id: id,
      _rev: `1-${Math.random().toString(16).substring(2, 14)}`,
      id,
      createdAt: now,
      updatedAt: now,
    };
    records.unshift(newDoc);
    return newDoc;
  },

  async update(id: string, updates: Partial<SecurityRecord>): Promise<SecurityRecord | null> {
    const index = records.findIndex((r) => r._id === id || r.id === id);
    if (index === -1) return null;

    const current = records[index];
    const revNumber = parseInt(current._rev?.split('-')[0] || '1', 10) + 1;
    const updated: SecurityRecord = {
      ...current,
      ...updates,
      _id: current._id,
      id: current.id,
      _rev: `${revNumber}-${Math.random().toString(16).substring(2, 14)}`,
      updatedAt: new Date().toISOString(),
    };

    records[index] = updated;
    return updated;
  },

  async delete(id: string): Promise<boolean> {
    const initialLen = records.length;
    records = records.filter((r) => r._id !== id && r.id !== id);
    return records.length < initialLen;
  },
};
