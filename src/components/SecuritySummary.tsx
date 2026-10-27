'use client';

import React from 'react';
import { SecurityRecord } from '@/lib/types';
import { ShieldAlert, FileText, CheckCircle, Activity } from 'lucide-react';

interface Props {
  records: SecurityRecord[];
}

export default function SecuritySummary({ records }: Props) {
  const total = records.length;
  const criticalOrHigh = records.filter(
    (r) => r.severity === 'CRITICAL' || r.severity === 'HIGH'
  ).length;
  const complianceDocs = records.filter(
    (r) => r.type === 'compliance_document'
  ).length;
  const uniqueSystems = new Set(records.flatMap((r) => r.affectedSystems || [])).size;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        margin: '0 24px 24px 24px',
      }}
    >
      {/* Metric 1 */}
      <div
        className="glass-panel"
        style={{
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(15, 98, 254, 0.15)',
            color: '#3b82f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Activity style={{ width: '24px', height: '24px' }} />
        </div>
        <div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Total Cloud Records
          </p>
          <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
            {total}
          </p>
          <span style={{ fontSize: '0.7rem', color: '#10b981' }}>Active in IBM Cloudant</span>
        </div>
      </div>

      {/* Metric 2 */}
      <div
        className="glass-panel"
        style={{
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(244, 63, 94, 0.15)',
            color: '#f43f5e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ShieldAlert style={{ width: '24px', height: '24px' }} />
        </div>
        <div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Critical / High Incidents
          </p>
          <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f43f5e', lineHeight: 1.1 }}>
            {criticalOrHigh}
          </p>
          <span style={{ fontSize: '0.7rem', color: criticalOrHigh > 0 ? '#fb7171' : '#10b981' }}>
            {criticalOrHigh > 0 ? 'Requires immediate action' : 'Zero elevated threats'}
          </span>
        </div>
      </div>

      {/* Metric 3 */}
      <div
        className="glass-panel"
        style={{
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(139, 92, 246, 0.15)',
            color: '#a855f7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FileText style={{ width: '24px', height: '24px' }} />
        </div>
        <div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Compliance Documents
          </p>
          <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
            {complianceDocs}
          </p>
          <span style={{ fontSize: '0.7rem', color: '#c084fc' }}>SOC2 / ISO 27001 Audits</span>
        </div>
      </div>

      {/* Metric 4 */}
      <div
        className="glass-panel"
        style={{
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(6, 182, 212, 0.15)',
            color: '#06b6d4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CheckCircle style={{ width: '24px', height: '24px' }} />
        </div>
        <div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Monitored Cloud Systems
          </p>
          <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
            {uniqueSystems}
          </p>
          <span style={{ fontSize: '0.7rem', color: '#38bdf8' }}>Isolated by K8s NetPol</span>
        </div>
      </div>
    </div>
  );
}
