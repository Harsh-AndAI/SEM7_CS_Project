'use client';

import React from 'react';
import { SecurityRecord } from '@/lib/types';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  record: SecurityRecord | null;
  loading: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  record,
  loading,
}: Props) {
  if (!isOpen || !record) return null;

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
          maxWidth: '460px',
          padding: '24px',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div
            style={{
              padding: '10px',
              borderRadius: '10px',
              background: 'rgba(244, 63, 94, 0.15)',
              color: '#f43f5e',
            }}
          >
            <AlertTriangle style={{ width: '24px', height: '24px' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
              Confirm Deletion
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Database: IBM Cloudant NoSQL
            </p>
          </div>
        </div>

        <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.5', marginBottom: '16px' }}>
          Are you sure you want to permanently delete record{' '}
          <strong style={{ color: '#fff' }}>&quot;{record.title}&quot;</strong>?
        </p>

        <div
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '10px',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-dim)',
            marginBottom: '20px',
          }}
        >
          _id: {record._id || record.id} <br />
          _rev: {record._rev || '1-local'}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="button" onClick={onClose} disabled={loading} className="btn-secondary">
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="btn-danger"
            style={{ background: '#e11d48', color: '#fff' }}
          >
            <Trash2 style={{ width: '15px', height: '15px' }} />
            <span>{loading ? 'Deleting...' : 'Delete Permanently'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
