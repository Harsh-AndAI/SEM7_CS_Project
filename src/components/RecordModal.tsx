'use client';

import React, { useState, useEffect } from 'react';
import { SecurityRecord, SeverityLevel, ComplianceClassification, IncidentStatus } from '@/lib/types';
import { X, Save, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (recordData: Partial<SecurityRecord>) => Promise<void>;
  initialData?: SecurityRecord | null;
}

export default function RecordModal({ isOpen, onClose, onSave, initialData }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'security_incident' | 'compliance_document'>('security_incident');
  const [severity, setSeverity] = useState<SeverityLevel>('MEDIUM');
  const [classification, setClassification] = useState<ComplianceClassification>('INTERNAL');
  const [status, setStatus] = useState<IncidentStatus>('OPEN');
  const [affectedSystemsInput, setAffectedSystemsInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [remediationPlan, setRemediationPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setType(initialData.type || 'security_incident');
      setSeverity(initialData.severity || 'MEDIUM');
      setClassification(initialData.classification || 'INTERNAL');
      setStatus(initialData.status || 'OPEN');
      setAffectedSystemsInput(initialData.affectedSystems?.join(', ') || '');
      setTagsInput(initialData.tags?.join(', ') || '');
      setRemediationPlan(initialData.remediationPlan || '');
    } else {
      setTitle('');
      setDescription('');
      setType('security_incident');
      setSeverity('MEDIUM');
      setClassification('INTERNAL');
      setStatus('OPEN');
      setAffectedSystemsInput('k8s-pod-auth, minikube-worker');
      setTagsInput('cloudant, zero-trust');
      setRemediationPlan('');
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const affectedSystems = affectedSystemsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const tags = tagsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await onSave({
        title,
        description,
        type,
        severity,
        classification,
        status,
        affectedSystems,
        tags,
        remediationPlan,
      });
      onClose();
    } catch (err) {
      setError((err as Error).message || 'Failed to save record.');
    } finally {
      setLoading(false);
    }
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
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '28px',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
              {initialData ? 'Edit Security Record' : 'Create New Cloud Record'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Target: IBM Cloudant NoSQL Database with CouchDB revision tracking
            </p>
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

        {error && (
          <div
            style={{
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#f43f5e',
              padding: '10px 14px',
              borderRadius: '8px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.85rem',
            }}
          >
            <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Row 1: Title */}
          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">Record Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Unauthorized Ingress Request to Minikube Endpoint"
              className="form-input"
            />
          </div>

          {/* Row 2: Type, Severity, Classification */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            <div>
              <label className="form-label">Record Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'security_incident' | 'compliance_document')}
                className="form-select"
              >
                <option value="security_incident">Security Incident</option>
                <option value="compliance_document">Compliance Document</option>
              </select>
            </div>

            <div>
              <label className="form-label">Severity Level</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as SeverityLevel)}
                className="form-select"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            <div>
              <label className="form-label">Classification</label>
              <select
                value={classification}
                onChange={(e) => setClassification(e.target.value as ComplianceClassification)}
                className="form-select"
              >
                <option value="PUBLIC">Public</option>
                <option value="INTERNAL">Internal</option>
                <option value="CONFIDENTIAL">Confidential</option>
                <option value="RESTRICTED">Restricted</option>
              </select>
            </div>
          </div>

          {/* Row 3: Status */}
          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">Resolution Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as IncidentStatus)}
              className="form-select"
            >
              <option value="OPEN">Open</option>
              <option value="INVESTIGATING">Investigating</option>
              <option value="MITIGATED">Mitigated</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          {/* Row 4: Description */}
          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">Description / Root Cause *</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of the event, affected pod/container, or audit criteria..."
              className="form-textarea"
            />
          </div>

          {/* Row 5: Affected Systems & Tags */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            <div>
              <label className="form-label">Affected Systems (comma-separated)</label>
              <input
                type="text"
                value={affectedSystemsInput}
                onChange={(e) => setAffectedSystemsInput(e.target.value)}
                placeholder="k8s-pod-auth, cloudant-db, ingress-lb"
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Security Tags (comma-separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="cve-2026, network-policy, ibm-appid"
                className="form-input"
              />
            </div>
          </div>

          {/* Row 6: Remediation Plan */}
          <div style={{ marginBottom: '24px' }}>
            <label className="form-label">Mitigation / Remediation Plan</label>
            <textarea
              rows={2}
              value={remediationPlan}
              onChange={(e) => setRemediationPlan(e.target.value)}
              placeholder="Action taken or planned to isolate pods, rotate credentials, or enforce policy..."
              className="form-textarea"
            />
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              <Save style={{ width: '16px', height: '16px' }} />
              <span>{loading ? 'Saving...' : initialData ? 'Update Record' : 'Save to Cloudant'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
