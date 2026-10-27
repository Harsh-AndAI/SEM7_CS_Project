'use client';

import React, { useState } from 'react';
import { SecurityRecord } from '@/lib/types';
import { X, Copy, Check, Database, Shield, Server, Clock, User, Tag } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  record: SecurityRecord | null;
}

export default function RecordDetailModal({ isOpen, onClose, record }: Props) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !record) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(record, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '20px',
      }}
    >
      <div
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '720px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '28px',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-public">{record.type}</span>
              <span className="badge badge-critical">{record.severity}</span>
              <span className="badge badge-internal">{record.classification}</span>
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>
              {record.title}
            </h3>
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

        {/* Database & Metadata Bar */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.6)',
            padding: '12px 16px',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)',
            marginBottom: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            alignItems: 'center',
            fontSize: '0.78rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Database style={{ width: '15px', height: '15px', color: '#06b6d4' }} />
            <span style={{ color: 'var(--text-muted)' }}>CouchDB _id:</span>
            <code style={{ color: '#38bdf8' }}>{record._id || record.id}</code>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Shield style={{ width: '15px', height: '15px', color: '#10b981' }} />
            <span style={{ color: 'var(--text-muted)' }}>CouchDB _rev:</span>
            <code style={{ color: '#34d399' }}>{record._rev || '1-local'}</code>
          </div>
        </div>

        {/* Description Section */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Description
          </h4>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#e2e8f0', background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '8px' }}>
            {record.description}
          </p>
        </div>

        {/* Remediation Plan */}
        {record.remediationPlan && (
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: '#10b981', marginBottom: '8px' }}>
              Remediation & Mitigation Plan
            </h4>
            <p style={{ fontSize: '0.88rem', lineHeight: '1.5', color: '#cbd5e1', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '12px', borderRadius: '8px' }}>
              {record.remediationPlan}
            </p>
          </div>
        )}

        {/* Affected Systems and Tags */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Affected Systems
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {record.affectedSystems?.map((sys) => (
                <span
                  key={sys}
                  style={{
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    color: '#93c5fd',
                    background: 'rgba(15, 98, 254, 0.1)',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Server style={{ width: '12px', height: '12px' }} />
                  {sys}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Security Tags
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {record.tags?.map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--cyan-accent)',
                    background: 'rgba(6, 182, 212, 0.12)',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Tag style={{ width: '10px', height: '10px' }} />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Audit Details */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '16px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <User style={{ width: '14px', height: '14px', color: '#a855f7' }} />
            <span>
              Reported By: <strong style={{ color: '#fff' }}>{record.reportedBy?.name}</strong> ({record.reportedBy?.email})
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock style={{ width: '14px', height: '14px', color: '#06b6d4' }} />
            <span>Created: {new Date(record.createdAt).toLocaleString()}</span>
          </div>
        </div>

        {/* Raw JSON Accordion / Export */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 600 }}>
              Raw Cloudant Document (JSON)
            </span>
            <button
              onClick={handleCopyJson}
              className="btn-secondary"
              style={{ padding: '4px 8px', fontSize: '0.72rem' }}
            >
              {copied ? <Check style={{ width: '12px', height: '12px', color: '#10b981' }} /> : <Copy style={{ width: '12px', height: '12px' }} />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>
          <pre
            style={{
              background: '#090d16',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '0.75rem',
              color: '#93c5fd',
              maxHeight: '180px',
              overflowY: 'auto',
            }}
          >
            {JSON.stringify(record, null, 2)}
          </pre>
        </div>

        {/* Close Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn-secondary">
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
}
