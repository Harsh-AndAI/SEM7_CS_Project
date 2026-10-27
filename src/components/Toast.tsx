'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface Props {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function Toast({ toasts, onDismiss }: Props) {
  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 200,
      }}
    >
      {toasts.map((t) => {
        const isSuccess = t.type === 'success';
        const isError = t.type === 'error';

        return (
          <div
            key={t.id}
            className="animate-fade-in"
            style={{
              minWidth: '300px',
              maxWidth: '420px',
              padding: '12px 16px',
              borderRadius: '12px',
              background: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(12px)',
              border: `1px solid ${
                isSuccess
                  ? 'rgba(16, 185, 129, 0.4)'
                  : isError
                  ? 'rgba(244, 63, 94, 0.4)'
                  : 'rgba(14, 165, 233, 0.4)'
              }`,
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {isSuccess && <CheckCircle2 style={{ width: '18px', height: '18px', color: '#10b981', flexShrink: 0 }} />}
              {isError && <AlertCircle style={{ width: '18px', height: '18px', color: '#f43f5e', flexShrink: 0 }} />}
              {!isSuccess && !isError && <Info style={{ width: '18px', height: '18px', color: '#38bdf8', flexShrink: 0 }} />}
              <span style={{ fontSize: '0.85rem', color: '#f8fafc', fontWeight: 500 }}>
                {t.message}
              </span>
            </div>
            <button
              onClick={() => onDismiss(t.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <X style={{ width: '14px', height: '14px' }} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
