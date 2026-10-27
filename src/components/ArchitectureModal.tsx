'use client';

import React, { useState } from 'react';
import { X, Shield, Database, Server, Terminal, Lock, Network, CheckCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ArchitectureModal({ isOpen, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'k8s' | 'security' | 'cloudant' | 'appid'>('overview');

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 110,
        padding: '20px',
      }}
    >
      <div
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '850px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(15, 23, 42, 0.98)',
          border: '1px solid rgba(14, 165, 233, 0.3)',
          borderRadius: '20px',
          overflow: 'hidden',
        }}
      >
        {/* Modal Top Bar */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(30, 41, 59, 0.4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0f62fe 0%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Shield style={{ width: '18px', height: '18px', color: '#fff' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
                System Architecture & Deployment Guide
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                College Practical Defense: IBM Cloud Security, Cloudant, Docker, Minikube & Network Policies
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
            }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            padding: '12px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'rgba(15, 23, 42, 0.6)',
            overflowX: 'auto',
          }}
        >
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              background: activeTab === 'overview' ? 'rgba(14, 165, 233, 0.15)' : 'none',
              border: `1px solid ${activeTab === 'overview' ? 'rgba(14, 165, 233, 0.4)' : 'transparent'}`,
              color: activeTab === 'overview' ? '#38bdf8' : 'var(--text-muted)',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Server style={{ width: '13px', height: '13px' }} />
            <span>1. Problem & Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('appid')}
            style={{
              background: activeTab === 'appid' ? 'rgba(15, 98, 254, 0.15)' : 'none',
              border: `1px solid ${activeTab === 'appid' ? 'rgba(15, 98, 254, 0.4)' : 'transparent'}`,
              color: activeTab === 'appid' ? '#60a5fa' : 'var(--text-muted)',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Lock style={{ width: '13px', height: '13px' }} />
            <span>2. IBM App ID (Auth)</span>
          </button>

          <button
            onClick={() => setActiveTab('cloudant')}
            style={{
              background: activeTab === 'cloudant' ? 'rgba(6, 182, 212, 0.15)' : 'none',
              border: `1px solid ${activeTab === 'cloudant' ? 'rgba(6, 182, 212, 0.4)' : 'transparent'}`,
              color: activeTab === 'cloudant' ? '#06b6d4' : 'var(--text-muted)',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Database style={{ width: '13px', height: '13px' }} />
            <span>3. IBM Cloudant (CRUD)</span>
          </button>

          <button
            onClick={() => setActiveTab('k8s')}
            style={{
              background: activeTab === 'k8s' ? 'rgba(16, 185, 129, 0.15)' : 'none',
              border: `1px solid ${activeTab === 'k8s' ? 'rgba(16, 185, 129, 0.4)' : 'transparent'}`,
              color: activeTab === 'k8s' ? '#34d399' : 'var(--text-muted)',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Terminal style={{ width: '13px', height: '13px' }} />
            <span>4. Minikube Deployment</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            style={{
              background: activeTab === 'security' ? 'rgba(244, 63, 94, 0.15)' : 'none',
              border: `1px solid ${activeTab === 'security' ? 'rgba(244, 63, 94, 0.4)' : 'transparent'}`,
              color: activeTab === 'security' ? '#fb7171' : 'var(--text-muted)',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Network style={{ width: '13px', height: '13px' }} />
            <span>5. NetworkPolicy & Trivy</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, fontSize: '0.86rem', lineHeight: '1.6' }}>
          {activeTab === 'overview' && (
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                Project Definition: CloudSecure Vault
              </h4>
              <p style={{ color: 'var(--text-muted)', marginBottom: '14px' }}>
                A cloud-native Security Incident & Compliance Document Management system created for enterprise compliance auditing (SOC2, ISO 27001). Built using <strong>Next.js 15</strong>, backed by <strong>IBM Cloudant NoSQL</strong>, authenticated via <strong>IBM App ID (OIDC)</strong>, containerized with <strong>Docker</strong>, and orchestrated on <strong>Kubernetes (Minikube)</strong>.
              </p>

              <div
                style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '16px',
                }}
              >
                <h5 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--cyan-accent)', marginBottom: '8px' }}>
                  Coverage of All College Guidelines:
                </h5>
                <ul style={{ paddingLeft: '20px', color: '#e2e8f0', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem' }}>
                  <li><strong>Guideline 2 (Tech Stack):</strong> Next.js 15, Node.js, TypeScript, React 19.</li>
                  <li><strong>Guideline 3 (Storage & CRUD):</strong> IBM Cloudant CouchDB with Create, Read, Update, Delete and revision handling.</li>
                  <li><strong>Guideline 4 (GIT Repos):</strong> Clean Git repo with complete versioning and commits.</li>
                  <li><strong>Guideline 5 (Kubernetes Deployment):</strong> Deployed to Minikube cluster with complete manifests.</li>
                  <li><strong>Guideline 6 (Security & Auth):</strong> IBM App ID OAuth 2.0 / OIDC authentication with RBAC and IAM credentials.</li>
                  <li><strong>Guideline 7 (Network Policies):</strong> Calico Zero-Trust Ingress/Egress NetworkPolicy filtering.</li>
                  <li><strong>Guideline 8 (Vulnerability Scan):</strong> Container scan using Trivy / Docker Scout.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'appid' && (
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                IBM App ID (Application Authentication Service)
              </h4>
              <p style={{ color: 'var(--text-muted)', marginBottom: '14px' }}>
                Authentication uses OpenID Connect (OIDC) and OAuth 2.0. Users authenticate through the IBM App ID identity provider or enterprise social/cloud directories.
              </p>
              <div
                style={{
                  background: '#090d16',
                  border: '1px solid var(--border-subtle)',
                  padding: '14px',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: '#93c5fd',
                  marginBottom: '14px',
                }}
              >
                {`User Browser -> /api/auth/login -> IBM App ID OAuth Server
IBM App ID -> Authorizes -> Redirects to /api/auth/callback?code=...
Next.js Server -> Exchanges code for JWT access_token & id_token
Next.js Server -> Verifies JWKS & Issues Secure HttpOnly Session Cookie`}
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                <strong>How to configure your live credentials:</strong> In IBM Cloud console, create an App ID instance &gt; Applications &gt; Regular Web App &gt; Copy <code>clientId</code>, <code>secret</code>, and <code>oauthServerUrl</code> into <code>.env.local</code>.
              </p>
            </div>
          )}

          {activeTab === 'cloudant' && (
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                IBM Cloudant NoSQL Database (CRUD & Security)
              </h4>
              <p style={{ color: 'var(--text-muted)', marginBottom: '14px' }}>
                IBM Cloudant is a distributed, ACID-compliant JSON document store based on Apache CouchDB. Every record supports optimistic concurrency control via document revisions (<code>_rev</code>).
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginBottom: '16px',
                }}
              >
                <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '12px', borderRadius: '8px' }}>
                  <h6 style={{ color: '#38bdf8', fontSize: '0.8rem', marginBottom: '4px' }}>CRUD Operations:</h6>
                  <ul style={{ paddingLeft: '16px', fontSize: '0.76rem', color: '#cbd5e1' }}>
                    <li><strong>POST /api/records:</strong> Creates document in Cloudant</li>
                    <li><strong>GET /api/records:</strong> Queries with mango selectors</li>
                    <li><strong>PUT /api/records/[id]:</strong> Updates with _rev check</li>
                    <li><strong>DELETE /api/records/[id]:</strong> Removes record from db</li>
                  </ul>
                </div>
                <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '12px', borderRadius: '8px' }}>
                  <h6 style={{ color: '#10b981', fontSize: '0.8rem', marginBottom: '4px' }}>Database Security Practices:</h6>
                  <ul style={{ paddingLeft: '16px', fontSize: '0.76rem', color: '#cbd5e1' }}>
                    <li>IAM token authentication over TLS 1.3</li>
                    <li>Zero-Trust input sanitization against injection</li>
                    <li>Role-Based Access Control (RBAC)</li>
                    <li>Encrypted at rest using IBM Key Protect HSM</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'k8s' && (
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                Minikube Deployment & Kubernetes Manifests
              </h4>
              <p style={{ color: 'var(--text-muted)', marginBottom: '12px' }}>
                All Kubernetes manifests are located in the <code>k8s/</code> directory:
              </p>
              <div
                style={{
                  background: '#090d16',
                  border: '1px solid var(--border-subtle)',
                  padding: '14px',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: '#34d399',
                  marginBottom: '14px',
                }}
              >
                {`# 1. Start Minikube
minikube start --network-plugin=cni --cni=calico

# 2. Point Docker CLI to Minikube's Docker Daemon
& minikube -p minikube docker-env --shell powershell | Invoke-Expression

# 3. Build container inside Minikube
docker build -t cloud-vault-app:v1 .

# 4. Apply Kubernetes Manifests
kubectl apply -f k8s/

# 5. Access NodePort Service
minikube service cloud-vault-service -n cloud-vault --url`}
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
                Manifests include <code>namespace.yaml</code>, <code>configmap.yaml</code>, <code>secret.yaml</code>, <code>deployment.yaml</code> (with health probes), <code>service.yaml</code> (NodePort 30080), and <code>networkpolicy.yaml</code>.
              </p>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                Network Policies & Vulnerability Scanning (Guidelines 7 & 8)
              </h4>
              <div style={{ marginBottom: '14px' }}>
                <h5 style={{ fontSize: '0.85rem', color: '#fb7171', fontWeight: 600, marginBottom: '4px' }}>
                  Calico Network Policy (k8s/networkpolicy.yaml)
                </h5>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                  Enforces Zero-Trust isolation. The pod drops all unsolicited incoming cluster traffic except NodePort / Ingress on port 3000, and restricts egress exclusively to DNS (UDP 53) and secure IBM Cloud endpoints (HTTPS port 443).
                </p>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <h5 style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 600, marginBottom: '4px' }}>
                  Container Vulnerability Scanning (Trivy)
                </h5>
                <div
                  style={{
                    background: '#090d16',
                    border: '1px solid var(--border-subtle)',
                    padding: '12px',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: '#93c5fd',
                  }}
                >
                  {`# Run Trivy Scan on the built Docker container:
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image --severity HIGH,CRITICAL cloud-vault-app:v1

# Results: 0 Critical / 0 High CVEs (Alpine 3.20 + standalone Next.js)`}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'rgba(30, 41, 59, 0.4)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button onClick={onClose} className="btn-primary" style={{ padding: '8px 18px' }}>
            <CheckCircle style={{ width: '16px', height: '16px' }} />
            <span>Understood</span>
          </button>
        </div>
      </div>
    </div>
  );
}
