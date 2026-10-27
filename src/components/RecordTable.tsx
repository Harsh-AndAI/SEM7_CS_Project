'use client';

import React from 'react';
import { SecurityRecord, SeverityLevel, ComplianceClassification, IncidentStatus, UserSession } from '@/lib/types';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit2,
  Trash2,
  FileCheck,
  AlertOctagon,
  Clock,
  Tag,
  Server,
} from 'lucide-react';

interface Props {
  records: SecurityRecord[];
  user: UserSession | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  severityFilter: string;
  onSeverityChange: (s: string) => void;
  statusFilter: string;
  onStatusChange: (st: string) => void;
  typeFilter: string;
  onTypeChange: (t: string) => void;
  onOpenCreateModal: () => void;
  onViewRecord: (r: SecurityRecord) => void;
  onEditRecord: (r: SecurityRecord) => void;
  onDeleteRecord: (r: SecurityRecord) => void;
}

export default function RecordTable({
  records,
  user,
  searchQuery,
  onSearchChange,
  severityFilter,
  onSeverityChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  onOpenCreateModal,
  onViewRecord,
  onEditRecord,
  onDeleteRecord,
}: Props) {
  const canDelete = user?.role === 'admin' || user?.role === 'security_analyst';

  const getSeverityBadgeClass = (s: SeverityLevel) => {
    switch (s) {
      case 'CRITICAL':
        return 'badge-critical';
      case 'HIGH':
        return 'badge-high';
      case 'MEDIUM':
        return 'badge-medium';
      case 'LOW':
        return 'badge-low';
      default:
        return 'badge-low';
    }
  };

  const getClassificationBadgeClass = (c: ComplianceClassification) => {
    switch (c) {
      case 'RESTRICTED':
        return 'badge-restricted';
      case 'CONFIDENTIAL':
        return 'badge-confidential';
      case 'INTERNAL':
        return 'badge-internal';
      case 'PUBLIC':
        return 'badge-public';
      default:
        return 'badge-internal';
    }
  };

  const getStatusBadgeStyle = (status: IncidentStatus) => {
    switch (status) {
      case 'OPEN':
        return { background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' };
      case 'INVESTIGATING':
        return { background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' };
      case 'MITIGATED':
        return { background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', border: '1px solid rgba(6, 182, 212, 0.3)' };
      case 'RESOLVED':
      case 'CLOSED':
        return { background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' };
    }
  };

  return (
    <div className="glass-panel" style={{ margin: '0 24px 40px 24px', padding: '24px' }}>
      {/* Table Header Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
            Managed Cloud Records & Dynamic Content
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Real-time CRUD operations stored in IBM Cloudant with version control (_rev)
          </p>
        </div>

        {/* Create Record Button */}
        <button
          onClick={onOpenCreateModal}
          className="btn-primary"
          style={{ padding: '10px 20px' }}
        >
          <Plus style={{ width: '18px', height: '18px' }} />
          <span>New Security Record</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: '20px',
          padding: '12px 16px',
          background: 'rgba(15, 23, 42, 0.5)',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
        }}
      >
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1 1 240px' }}>
          <Search
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '16px',
              height: '16px',
              color: 'var(--text-dim)',
            }}
          />
          <input
            type="text"
            placeholder="Search titles, tags, affected systems..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '36px' }}
          />
        </div>

        {/* Severity Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Filter style={{ width: '14px', height: '14px', color: 'var(--text-dim)' }} />
          <select
            value={severityFilter}
            onChange={(e) => onSeverityChange(e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '8px 12px', fontSize: '0.82rem' }}
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '8px 12px', fontSize: '0.82rem' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="INVESTIGATING">Investigating</option>
            <option value="MITIGATED">Mitigated</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <select
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '8px 12px', fontSize: '0.82rem' }}
          >
            <option value="ALL">All Categories</option>
            <option value="security_incident">Security Incidents</option>
            <option value="compliance_document">Compliance Documents</option>
          </select>
        </div>
      </div>

      {/* Table Records List */}
      {records.length === 0 ? (
        <div
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            background: 'rgba(15, 23, 42, 0.3)',
            borderRadius: '12px',
          }}
        >
          <AlertOctagon style={{ width: '40px', height: '40px', color: 'var(--text-dim)', margin: '0 auto 12px' }} />
          <p style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>No records match your criteria</p>
          <p style={{ fontSize: '0.82rem', marginTop: '4px' }}>
            Try resetting filters or click &quot;New Security Record&quot; to create a new entry in IBM Cloudant.
          </p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                <th style={{ padding: '12px 14px' }}>Title & Description</th>
                <th style={{ padding: '12px 14px' }}>Severity</th>
                <th style={{ padding: '12px 14px' }}>Classification</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
                <th style={{ padding: '12px 14px' }}>Affected Systems</th>
                <th style={{ padding: '12px 14px' }}>Reported By</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => {
                const id = r._id || r.id || 'unknown';
                return (
                  <tr
                    key={id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Title & Type */}
                    <td style={{ padding: '14px', verticalAlign: 'top', maxWidth: '320px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        {r.type === 'security_incident' ? (
                          <AlertOctagon style={{ width: '16px', height: '16px', color: '#f43f5e', flexShrink: 0 }} />
                        ) : (
                          <FileCheck style={{ width: '16px', height: '16px', color: '#10b981', flexShrink: 0 }} />
                        )}
                        <span style={{ fontWeight: 600, color: '#fff', fontSize: '0.88rem' }}>
                          {r.title}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)',
                          lineHeight: 1.4,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {r.description}
                      </p>
                      {/* Tags */}
                      {r.tags && r.tags.length > 0 && (
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
                          {r.tags.map((t) => (
                            <span
                              key={t}
                              style={{
                                fontSize: '0.65rem',
                                color: 'var(--cyan-accent)',
                                background: 'rgba(6, 182, 212, 0.1)',
                                padding: '1px 6px',
                                borderRadius: '4px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                              }}
                            >
                              <Tag style={{ width: '9px', height: '9px' }} />
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Severity */}
                    <td style={{ padding: '14px', verticalAlign: 'top' }}>
                      <span className={`badge ${getSeverityBadgeClass(r.severity)}`}>
                        {r.severity}
                      </span>
                    </td>

                    {/* Classification */}
                    <td style={{ padding: '14px', verticalAlign: 'top' }}>
                      <span className={`badge ${getClassificationBadgeClass(r.classification)}`}>
                        {r.classification}
                      </span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '14px', verticalAlign: 'top' }}>
                      <span
                        className="badge"
                        style={getStatusBadgeStyle(r.status)}
                      >
                        {r.status}
                      </span>
                    </td>

                    {/* Affected Systems */}
                    <td style={{ padding: '14px', verticalAlign: 'top', maxWidth: '180px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {r.affectedSystems?.slice(0, 3).map((sys) => (
                          <span
                            key={sys}
                            style={{
                              fontSize: '0.7rem',
                              color: 'var(--text-muted)',
                              fontFamily: 'var(--font-mono)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <Server style={{ width: '11px', height: '11px', color: 'var(--text-dim)' }} />
                            {sys}
                          </span>
                        ))}
                        {r.affectedSystems && r.affectedSystems.length > 3 && (
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>
                            +{r.affectedSystems.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Reporter & Date */}
                    <td style={{ padding: '14px', verticalAlign: 'top' }}>
                      <div style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 500 }}>
                        {r.reportedBy?.name || 'System User'}
                      </div>
                      <div
                        style={{
                          fontSize: '0.7rem',
                          color: 'var(--text-dim)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          marginTop: '2px',
                        }}
                      >
                        <Clock style={{ width: '11px', height: '11px' }} />
                        {new Date(r.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Action Buttons */}
                    <td style={{ padding: '14px', verticalAlign: 'top', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        {/* View Button */}
                        <button
                          onClick={() => onViewRecord(r)}
                          className="btn-secondary"
                          style={{ padding: '6px 8px' }}
                          title="View Full Audit Record & CouchDB Metadata"
                        >
                          <Eye style={{ width: '14px', height: '14px' }} />
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => onEditRecord(r)}
                          className="btn-secondary"
                          style={{ padding: '6px 8px', color: '#38bdf8' }}
                          title="Edit Record"
                        >
                          <Edit2 style={{ width: '14px', height: '14px' }} />
                        </button>

                        {/* Delete Button */}
                        {canDelete && (
                          <button
                            onClick={() => onDeleteRecord(r)}
                            className="btn-danger"
                            style={{ padding: '6px 8px' }}
                            title="Delete Record from Database"
                          >
                            <Trash2 style={{ width: '14px', height: '14px' }} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
