'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SecurityRecord, UserSession, CloudServiceStatus } from '@/lib/types';
import Navbar from '@/components/Navbar';
import CloudServicesStatus from '@/components/CloudServicesStatus';
import SecuritySummary from '@/components/SecuritySummary';
import RecordTable from '@/components/RecordTable';
import RecordModal from '@/components/RecordModal';
import RecordDetailModal from '@/components/RecordDetailModal';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import ArchitectureModal from '@/components/ArchitectureModal';
import Toast, { ToastMessage } from '@/components/Toast';
import LoginGate from '@/components/LoginGate';

export default function HomePage() {
  const [records, setRecords] = useState<SecurityRecord[]>([]);
  const [user, setUser] = useState<UserSession | null>(null);
  const [status, setStatus] = useState<CloudServiceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SecurityRecord | null>(null);
  const [detailRecord, setDetailRecord] = useState<SecurityRecord | null>(null);
  const [deletingRecord, setDeletingRecord] = useState<SecurityRecord | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isArchOpen, setIsArchOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch Session (starts logged out unless user explicitly logs in)
  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.authenticated && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  // Fetch Cloud Services Status
  const fetchStatus = useCallback(async () => {
    setStatusLoading(true);
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      console.error('Failed to load status:', err);
    } finally {
      setStatusLoading(false);
    }
  }, []);

  // Fetch Records with query filters
  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (severityFilter !== 'ALL') params.set('severity', severityFilter);
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (typeFilter !== 'ALL') params.set('type', typeFilter);

      const res = await fetch(`/api/records?${params.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.records)) {
        setRecords(data.records);
      }
    } catch (err) {
      addToast('error', 'Failed to fetch records from database.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, severityFilter, statusFilter, typeFilter]);

  // Initial Load
  useEffect(() => {
    fetchUser();
    fetchStatus();
  }, [fetchUser, fetchStatus]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Role Switcher (Simulated RBAC)
  const handleSwitchRole = async (role: 'admin' | 'analyst' | 'auditor', notify = true) => {
    try {
      const res = await fetch('/api/auth/dev-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        if (notify) {
          addToast('success', `Switched identity to ${data.user.name} (${data.user.role})`);
        }
      }
    } catch (err) {
      addToast('error', 'Role switch failed.');
    }
  };

  // Sign out
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      addToast('info', 'Signed out successfully.');
    } catch {
      addToast('error', 'Failed to sign out.');
    }
  };

  // Save Record (Create or Update)
  const handleSaveRecord = async (recordData: Partial<SecurityRecord>) => {
    if (editingRecord) {
      // Update
      const id = editingRecord._id || editingRecord.id;
      const res = await fetch(`/api/records/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recordData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update record');
      }
      addToast('success', `Record "${data.record.title}" updated in IBM Cloudant.`);
    } else {
      // Create
      const res = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recordData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create record');
      }
      addToast('success', `Security record stored in IBM Cloudant.`);
    }
    fetchRecords();
  };

  // Delete Record
  const handleConfirmDelete = async () => {
    if (!deletingRecord) return;
    setDeleteLoading(true);
    const id = deletingRecord._id || deletingRecord.id;
    try {
      const res = await fetch(`/api/records/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete record');
      }
      addToast('success', 'Record permanently removed from database.');
      setDeletingRecord(null);
      fetchRecords();
    } catch (err) {
      addToast('error', (err as Error).message);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation */}
      <Navbar
        user={user}
        onRefresh={() => {
          fetchRecords();
          fetchStatus();
          addToast('info', 'Synchronized records with IBM Cloudant.');
        }}
        onOpenArchModal={() => setIsArchOpen(true)}
        onSwitchRole={handleSwitchRole}
        onLogout={handleLogout}
      />

      {/* Main Body: If logged out, show LoginGate. If authenticated, show full Dashboard */}
      {!user ? (
        <LoginGate
          onLoginClick={() => {
            const originParam = typeof window !== 'undefined' ? `?origin=${encodeURIComponent(window.location.origin)}` : '';
            window.location.href = `/api/auth/login${originParam}`;
          }}
          onSelectDemoRole={(role) => handleSwitchRole(role)}
          status={status}
          onOpenArchModal={() => setIsArchOpen(true)}
        />
      ) : (
        <>
          {/* Cloud Services Status Banner */}
          <CloudServicesStatus status={status} loading={statusLoading} />

          {/* Analytics Summary */}
          <SecuritySummary records={records} />

          {/* Main Records Table & CRUD Actions */}
          <main style={{ flex: 1 }}>
            <RecordTable
              records={records}
              user={user}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              severityFilter={severityFilter}
              onSeverityChange={setSeverityFilter}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              typeFilter={typeFilter}
              onTypeChange={setTypeFilter}
              onOpenCreateModal={() => {
                setEditingRecord(null);
                setIsCreateOpen(true);
              }}
              onViewRecord={(r) => setDetailRecord(r)}
              onEditRecord={(r) => {
                setEditingRecord(r);
                setIsCreateOpen(true);
              }}
              onDeleteRecord={(r) => {
                setDeletingRecord(r);
              }}
            />
          </main>
        </>
      )}

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '20px 24px',
          textAlign: 'center',
          color: 'var(--text-dim)',
          fontSize: '0.78rem',
          background: 'rgba(10, 13, 20, 0.8)',
        }}
      >
        <p>
          CloudSecure Vault &bull; IBM Cloud Security Services, Cloudant NoSQL &amp; Kubernetes (Minikube) Practical Project
        </p>
        <p style={{ marginTop: '4px', fontSize: '0.72rem' }}>
          Container Security &bull; Calico Network Policies &bull; Trivy Image Scan &bull; RBAC
        </p>
      </footer>

      {/* Modals */}
      <RecordModal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingRecord(null);
        }}
        onSave={handleSaveRecord}
        initialData={editingRecord}
      />

      <RecordDetailModal
        isOpen={!!detailRecord}
        onClose={() => setDetailRecord(null)}
        record={detailRecord}
      />

      <DeleteConfirmModal
        isOpen={!!deletingRecord}
        onClose={() => setDeletingRecord(null)}
        onConfirm={handleConfirmDelete}
        record={deletingRecord}
        loading={deleteLoading}
      />

      <ArchitectureModal
        isOpen={isArchOpen}
        onClose={() => setIsArchOpen(false)}
      />

      {/* Floating Toasts */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
