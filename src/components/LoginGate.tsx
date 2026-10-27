'use client';

import React, { useState, useEffect } from 'react';
import { CloudServiceStatus } from '@/lib/types';
import { Shield, Lock, KeyRound, Server, Database, CheckCircle, ChevronDown, ExternalLink, AlertTriangle } from 'lucide-react';

interface Props {
  onLoginClick: () => void;
  onSelectDemoRole: (role: 'admin' | 'analyst' | 'auditor') => void;
  status: CloudServiceStatus | null;
  onOpenArchModal: () => void;
}

export default function LoginGate({
  onLoginClick,
  onSelectDemoRole,
  status,
  onOpenArchModal,
}: Props) {
  const [showDemoOptions, setShowDemoOptions] = useState(false);
  const [currentOrigin, setCurrentOrigin] = useState('http://localhost:3000');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentOrigin(window.location.origin);
    }
  }, []);

  const expectedRedirectUri = `${currentOrigin}/api/auth/callback`;

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px 20px',
        minHeight: 'calc(100vh - 120px)',
      }}
    >
      <div
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '540px',
          padding: '36px 32px',
          background: 'rgba(15, 23, 42, 0.92)',
          border: '1px solid rgba(15, 98, 254, 0.35)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(15, 98, 254, 0.2)',
          textAlign: 'center',
        }}
      >
        {/* Shield Icon Logo */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #0f62fe 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 0 24px rgba(15, 98, 254, 0.5)',
          }}
        >
          <Lock style={{ width: '32px', height: '32px', color: '#fff' }} />
        </div>

        {/* Title */}
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '8px' }}>
          CloudSecure <span style={{ color: 'var(--cyan-accent)' }}>Vault</span>
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '24px' }}>
          Zero-Trust Cloud Incident & Compliance Portal. Authenticate through IBM App ID to access confidential records and audit logs.
        </p>

        {/* Cloud Security Badges */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
          <span className="badge badge-public" style={{ fontSize: '0.7rem' }}>
            IBM APP ID (OIDC)
          </span>
          <span className="badge badge-low" style={{ fontSize: '0.7rem' }}>
            IBM CLOUDANT (NoSQL)
          </span>
          <span className="badge badge-internal" style={{ fontSize: '0.7rem' }}>
            K8S CALICO NETPOL
          </span>
        </div>

        {/* Primary Action: IBM App ID Login */}
        <button
          onClick={onLoginClick}
          className="btn-primary"
          style={{
            width: '100%',
            padding: '14px 20px',
            fontSize: '1rem',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0f62fe 0%, #0043ce 100%)',
            marginBottom: '16px',
            boxShadow: '0 8px 24px rgba(15, 98, 254, 0.45)',
          }}
        >
          <KeyRound style={{ width: '18px', height: '18px' }} />
          <span>Sign In with IBM App ID</span>
        </button>

        {/* Redirect URI Help Note to prevent "Invalid redirect_uri" */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '12px',
            borderRadius: '10px',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            textAlign: 'left',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24', fontWeight: 600, marginBottom: '4px' }}>
            <AlertTriangle style={{ width: '13px', height: '13px' }} />
            <span>Required in IBM Cloud Console:</span>
          </div>
          <p style={{ lineHeight: '1.4', marginBottom: '6px' }}>
            Make sure this exact redirect URL is saved under <strong>App ID &gt; Manage Authentication &gt; Authentication Settings &gt; Web redirect URLs</strong>:
          </p>
          <code
            style={{
              display: 'block',
              background: '#090d16',
              padding: '6px 8px',
              borderRadius: '6px',
              color: '#38bdf8',
              fontFamily: 'var(--font-mono)',
              wordBreak: 'break-all',
            }}
          >
            {expectedRedirectUri}
          </code>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            or practical demonstration
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
        </div>

        {/* Demo Roles Simulation Accordion */}
        <div>
          <button
            onClick={() => setShowDemoOptions(!showDemoOptions)}
            className="btn-secondary"
            style={{
              width: '100%',
              padding: '10px 16px',
              fontSize: '0.84rem',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield style={{ width: '15px', height: '15px', color: 'var(--cyan-accent)' }} />
              <span>Select Simulation Role (RBAC Demo)</span>
            </div>
            <ChevronDown
              style={{
                width: '15px',
                height: '15px',
                transform: showDemoOptions ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s ease',
              }}
            />
          </button>

          {showDemoOptions && (
            <div
              className="animate-fade-in"
              style={{
                marginTop: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                background: 'rgba(15, 23, 42, 0.6)',
                padding: '10px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <button
                onClick={() => onSelectDemoRole('admin')}
                className="btn-secondary"
                style={{
                  padding: '8px 12px',
                  justifyContent: 'flex-start',
                  fontSize: '0.78rem',
                  borderColor: 'rgba(244, 63, 94, 0.3)',
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f43f5e', marginRight: '6px' }} />
                <span>Security Admin (Full CRUD &amp; Cloudant Access)</span>
              </button>
              <button
                onClick={() => onSelectDemoRole('analyst')}
                className="btn-secondary"
                style={{
                  padding: '8px 12px',
                  justifyContent: 'flex-start',
                  fontSize: '0.78rem',
                  borderColor: 'rgba(6, 182, 212, 0.3)',
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#06b6d4', marginRight: '6px' }} />
                <span>SOC Analyst (Create, Edit &amp; View)</span>
              </button>
              <button
                onClick={() => onSelectDemoRole('auditor')}
                className="btn-secondary"
                style={{
                  padding: '8px 12px',
                  justifyContent: 'flex-start',
                  fontSize: '0.78rem',
                  borderColor: 'rgba(16, 185, 129, 0.3)',
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', marginRight: '6px' }} />
                <span>Compliance Auditor (Read-Only Audit Mode)</span>
              </button>
            </div>
          )}
        </div>

        {/* Live Service Status Footer inside Card */}
        <div
          style={{
            marginTop: '28px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.74rem',
            color: 'var(--text-dim)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Database style={{ width: '13px', height: '13px', color: '#10b981' }} />
            <span>Cloudant: <strong>Online</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Server style={{ width: '13px', height: '13px', color: '#06b6d4' }} />
            <span>App ID: <strong>Active</strong></span>
          </div>
          <button
            onClick={onOpenArchModal}
            style={{
              background: 'none',
              border: 'none',
              color: '#38bdf8',
              cursor: 'pointer',
              fontSize: '0.74rem',
              textDecoration: 'underline',
            }}
          >
            K8s Defense Guide
          </button>
        </div>
      </div>
    </div>
  );
}
