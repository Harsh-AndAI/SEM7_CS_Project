export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ComplianceClassification = 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';

export type IncidentStatus = 'OPEN' | 'INVESTIGATING' | 'MITIGATED' | 'RESOLVED' | 'CLOSED';

export interface SecurityRecord {
  _id?: string;
  _rev?: string;
  id?: string; // fallback / alias
  type: 'security_incident' | 'compliance_document';
  title: string;
  description: string;
  severity: SeverityLevel;
  classification: ComplianceClassification;
  status: IncidentStatus;
  affectedSystems: string[];
  tags: string[];
  reportedBy: {
    name: string;
    email: string;
    role: string;
  };
  remediationPlan?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'security_analyst' | 'compliance_auditor';
  avatar?: string;
  provider: 'ibm-appid' | 'local-simulation';
  accessToken?: string;
}

export interface CloudServiceStatus {
  cloudant: {
    status: 'connected' | 'demo_mode' | 'error';
    database: string;
    details: string;
    latencyMs?: number;
  };
  appid: {
    status: 'configured' | 'demo_mode' | 'missing_config';
    tenantId: string;
    oauthUrl: string;
    details: string;
  };
  cluster: {
    environment: 'minikube' | 'docker' | 'local';
    podName: string;
    namespace: string;
  };
}
