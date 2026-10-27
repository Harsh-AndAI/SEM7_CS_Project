'use client';

import React from 'react';
import { CloudServiceStatus } from '@/lib/types';
import { Database, Lock, Server, Network, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface Props {
  status: CloudServiceStatus | null;
  loading: boolean;
}

export default function CloudServicesStatus({ status, loading }: Props) {
  const isCloudantLive = status?.cloudant.status === 'connected';
  const isAppIdLive = status?.appid.status === 'configured';

  return (
    <div
      className="glass-panel"
      style={{
        margin: '0 24px 20px 24px',
        padding: '16px 20px',
        borderRadius: '16px',
        background: 'rgba(15, 23, 42, 0.65)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '14px',
        }}
      >
        {/* Service 1: IBM Cloudant NoSQL */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.45)',
            padding: '12px 14px',
            borderRadius: '12px',
            border: `1px solid ${isCloudantLive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.25)'}`,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          <div
            style={{
              padding: '8px',
              borderRadius: '8px',
              background: isCloudantLive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              color: isCloudantLive ? '#10b981' : '#f59e0b',
            }}
          >
            <Database style={{ width: '20px', height: '20px' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>IBM Cloudant (NoSQL)</span>
              <span
                className={`badge ${isCloudantLive ? 'badge-low' : 'badge-medium'}`}
                style={{ fontSize: '0.62rem', padding: '1px 6px' }}
              >
                {loading ? 'Checking...' : isCloudantLive ? 'LIVE CLUSTER' : 'SIMULATED'}
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>
              DB: <code style={{ color: '#38bdf8' }}>{status?.cloudant.database || 'cloud_vault_records'}</code>
              {status?.cloudant.latencyMs ? ` (${status.cloudant.latencyMs}ms)` : ''}
            </p>
            <p style={{ fontSize: '0.66rem', color: 'var(--text-dim)', marginTop: '3px' }}>
              {isCloudantLive ? 'TLS 1.3 IAM Bearer token authentication active' : 'Ready for Cloudant IAM credentials in .env.local'}
            </p>
          </div>
        </div>

        {/* Service 2: IBM App ID */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.45)',
            padding: '12px 14px',
            borderRadius: '12px',
            border: `1px solid ${isAppIdLive ? 'rgba(15, 98, 254, 0.35)' : 'rgba(139, 92, 246, 0.3)'}`,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          <div
            style={{
              padding: '8px',
              borderRadius: '8px',
              background: isAppIdLive ? 'rgba(15, 98, 254, 0.15)' : 'rgba(139, 92, 246, 0.15)',
              color: isAppIdLive ? '#3b82f6' : '#a855f7',
            }}
          >
            <Lock style={{ width: '20px', height: '20px' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>IBM App ID (OIDC)</span>
              <span
                className={`badge ${isAppIdLive ? 'badge-public' : 'badge-internal'}`}
                style={{ fontSize: '0.62rem', padding: '1px 6px' }}
              >
                {isAppIdLive ? 'OIDC ACTIVE' : 'DEV SIMULATION'}
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>
              OAuth2.0 / JWT session validation with RBAC
            </p>
            <p style={{ fontSize: '0.66rem', color: 'var(--text-dim)', marginTop: '3px' }}>
              {isAppIdLive ? 'Tenant bound & JWKS public key verified' : 'Instant RBAC testing (Admin, SOC, Auditor)'}
            </p>
          </div>
        </div>

        {/* Service 3: Kubernetes / Minikube Pod */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.45)',
            padding: '12px 14px',
            borderRadius: '12px',
            border: '1px solid rgba(6, 182, 212, 0.25)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          <div
            style={{
              padding: '8px',
              borderRadius: '8px',
              background: 'rgba(6, 182, 212, 0.15)',
              color: '#06b6d4',
            }}
          >
            <Server style={{ width: '20px', height: '20px' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>Cluster / Minikube</span>
              <span className="badge badge-low" style={{ fontSize: '0.62rem', padding: '1px 6px' }}>
                READY
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>
              Namespace: <code style={{ color: '#38bdf8' }}>{status?.cluster.namespace || 'cloud-vault'}</code>
            </p>
            <p style={{ fontSize: '0.66rem', color: 'var(--text-dim)', marginTop: '3px' }}>
              Pod: <code style={{ color: '#94a3b8' }}>{status?.cluster.podName || 'local-nextjs-node'}</code>
            </p>
          </div>
        </div>

        {/* Service 4: Security Policies & Scanner Status */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.45)',
            padding: '12px 14px',
            borderRadius: '12px',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          <div
            style={{
              padding: '8px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
            }}
          >
            <ShieldCheck style={{ width: '20px', height: '20px' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>Security & Policies</span>
              <span className="badge badge-low" style={{ fontSize: '0.62rem', padding: '1px 6px' }}>
                ENFORCED
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>
              Zero-Trust NetworkPolicy & Trivy Scanned
            </p>
            <p style={{ fontSize: '0.66rem', color: 'var(--text-dim)', marginTop: '3px' }}>
              Alpine Non-Root container (UID 1001)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
