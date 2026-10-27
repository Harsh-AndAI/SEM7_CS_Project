'use client';

import React, { useState, useEffect, useRef } from 'react';
import { UserSession } from '@/lib/types';
import { Shield, ShieldAlert, User, LogOut, KeyRound, Cpu, HelpCircle, RefreshCw, ChevronDown } from 'lucide-react';

interface NavbarProps {
  user: UserSession | null;
  onRefresh: () => void;
  onOpenArchModal: () => void;
  onSwitchRole: (role: 'admin' | 'analyst' | 'auditor') => void;
  onLogout: () => void;
}

export default function Navbar({
  user,
  onRefresh,
  onOpenArchModal,
  onSwitchRole,
  onLogout,
}: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const demoMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (demoMenuRef.current && !demoMenuRef.current.contains(event.target as Node)) {
        setDemoDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className="glass-panel"
      style={{
        margin: '16px 24px',
        padding: '12px 24px',
        borderRadius: '16px',
        position: 'relative',
        zIndex: 100, // High z-index to always stay above content cards
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        {/* Logo & Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0f62fe 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(15, 98, 254, 0.4)',
            }}
          >
            <Shield style={{ color: '#fff', width: '24px', height: '24px' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
                CloudSecure <span style={{ color: 'var(--cyan-accent)' }}>Vault</span>
              </h1>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  background: 'rgba(15, 98, 254, 0.2)',
                  color: '#60a5fa',
                  border: '1px solid rgba(15, 98, 254, 0.4)',
                  borderRadius: '6px',
                  letterSpacing: '0.05em',
                }}
              >
                IBM CLOUD & K8S
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Incident & Compliance Vault | IBM App ID & Cloudant NoSQL
            </p>
          </div>
        </div>

        {/* Action Controls & User Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            className="btn-secondary"
            style={{ padding: '8px 12px', fontSize: '0.8rem' }}
            title="Refresh database records"
          >
            <RefreshCw style={{ width: '15px', height: '15px' }} />
            <span>Sync</span>
          </button>

          {/* Architecture / Help Guide Button */}
          <button
            onClick={onOpenArchModal}
            className="btn-secondary"
            style={{
              padding: '8px 14px',
              fontSize: '0.8rem',
              borderColor: 'rgba(6, 182, 212, 0.3)',
              color: 'var(--cyan-accent)',
            }}
          >
            <HelpCircle style={{ width: '15px', height: '15px' }} />
            <span>Architecture & K8s Guide</span>
          </button>

          {/* User Profile / Auth State */}
          {user ? (
            <div style={{ position: 'relative' }} ref={menuRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="btn-secondary"
                style={{
                  padding: '6px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(30, 41, 59, 0.85)',
                  borderColor: user.provider === 'ibm-appid' ? '#0f62fe' : 'rgba(255, 255, 255, 0.2)',
                }}
              >
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    background:
                      user.role === 'admin'
                        ? 'rgba(244, 63, 94, 0.2)'
                        : user.role === 'security_analyst'
                        ? 'rgba(6, 182, 212, 0.2)'
                        : 'rgba(16, 185, 129, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <User
                    style={{
                      width: '16px',
                      height: '16px',
                      color:
                        user.role === 'admin'
                          ? '#f43f5e'
                          : user.role === 'security_analyst'
                          ? '#06b6d4'
                          : '#10b981',
                    }}
                  />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    {user.role.toUpperCase()} {user.provider === 'ibm-appid' ? '• Live App ID' : '• Demo Role'}
                  </div>
                </div>
                <ChevronDown style={{ width: '14px', height: '14px', color: 'var(--text-dim)', marginLeft: '4px' }} />
              </button>

              {/* Dropdown Menu - Styled Above All Layers */}
              {dropdownOpen && (
                <div
                  className="animate-fade-in"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '290px',
                    padding: '14px',
                    zIndex: 200, // Highest z-index to stay ABOVE all cards and status banners
                    background: 'rgba(15, 23, 42, 0.98)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(14, 165, 233, 0.35)',
                    borderRadius: '14px',
                    boxShadow: '0 20px 45px rgba(0, 0, 0, 0.85), 0 0 15px rgba(15, 98, 254, 0.2)',
                  }}
                >
                  <div style={{ padding: '4px 8px 10px 8px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '10px' }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Active Identity
                    </p>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', marginTop: '2px' }}>{user.email}</p>
                  </div>

                  <p style={{ fontSize: '0.68rem', color: 'var(--text-dim)', padding: '2px 8px 6px 8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Switch Demo Role (Instant RBAC)
                  </p>
                  <button
                    onClick={() => {
                      onSwitchRole('admin');
                      setDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 10px',
                      fontSize: '0.8rem',
                      background: 'none',
                      border: 'none',
                      color: '#f8fafc',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(244, 63, 94, 0.15)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                  >
                    <ShieldAlert style={{ width: '15px', height: '15px', color: '#f43f5e' }} />
                    <span>Security Admin (Full CRUD & RBAC)</span>
                  </button>
                  <button
                    onClick={() => {
                      onSwitchRole('analyst');
                      setDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 10px',
                      fontSize: '0.8rem',
                      background: 'none',
                      border: 'none',
                      color: '#f8fafc',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(6, 182, 212, 0.15)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                  >
                    <Cpu style={{ width: '15px', height: '15px', color: '#06b6d4' }} />
                    <span>SOC Analyst (Create, Update, View)</span>
                  </button>
                  <button
                    onClick={() => {
                      onSwitchRole('auditor');
                      setDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 10px',
                      fontSize: '0.8rem',
                      background: 'none',
                      border: 'none',
                      color: '#f8fafc',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                  >
                    <KeyRound style={{ width: '15px', height: '15px', color: '#10b981' }} />
                    <span>Compliance Auditor (Read-Only)</span>
                  </button>

                  <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '10px 0' }} />

                  {/* IBM App ID Direct Login Link */}
                  <a
                    href="/api/auth/login"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      fontSize: '0.8rem',
                      color: '#60a5fa',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(15, 98, 254, 0.15)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                  >
                    <Shield style={{ width: '15px', height: '15px' }} />
                    <span>Login via Live IBM App ID</span>
                  </a>

                  {/* Logout */}
                  <button
                    onClick={() => {
                      onLogout();
                      setDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 10px',
                      fontSize: '0.8rem',
                      background: 'none',
                      border: 'none',
                      color: '#f43f5e',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginTop: '4px',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(244, 63, 94, 0.15)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                  >
                    <LogOut style={{ width: '15px', height: '15px' }} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Logged Out Controls */
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Demo Roles Dropdown */}
              <div style={{ position: 'relative' }} ref={demoMenuRef}>
                <button
                  onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                  className="btn-secondary"
                  style={{
                    fontSize: '0.82rem',
                    padding: '8px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <User style={{ width: '14px', height: '14px', color: 'var(--cyan-accent)' }} />
                  <span>Select Demo Role</span>
                  <ChevronDown style={{ width: '13px', height: '13px', color: 'var(--text-dim)' }} />
                </button>

                {demoDropdownOpen && (
                  <div
                    className="animate-fade-in"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      width: '260px',
                      padding: '12px',
                      zIndex: 200,
                      background: 'rgba(15, 23, 42, 0.98)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(14, 165, 233, 0.35)',
                      borderRadius: '12px',
                      boxShadow: '0 20px 45px rgba(0, 0, 0, 0.85)',
                    }}
                  >
                    <p style={{ fontSize: '0.68rem', color: 'var(--text-dim)', padding: '2px 8px 6px', textTransform: 'uppercase' }}>
                      Choose Simulation Role
                    </p>
                    <button
                      onClick={() => {
                        onSwitchRole('admin');
                        setDemoDropdownOpen(false);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 10px',
                        fontSize: '0.8rem',
                        background: 'none',
                        border: 'none',
                        color: '#f8fafc',
                        cursor: 'pointer',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(244, 63, 94, 0.15)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                    >
                      <ShieldAlert style={{ width: '15px', height: '15px', color: '#f43f5e' }} />
                      <span>Security Admin (Full Access)</span>
                    </button>
                    <button
                      onClick={() => {
                        onSwitchRole('analyst');
                        setDemoDropdownOpen(false);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 10px',
                        fontSize: '0.8rem',
                        background: 'none',
                        border: 'none',
                        color: '#f8fafc',
                        cursor: 'pointer',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(6, 182, 212, 0.15)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                    >
                      <Cpu style={{ width: '15px', height: '15px', color: '#06b6d4' }} />
                      <span>SOC Analyst (Edit & Create)</span>
                    </button>
                    <button
                      onClick={() => {
                        onSwitchRole('auditor');
                        setDemoDropdownOpen(false);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 10px',
                        fontSize: '0.8rem',
                        background: 'none',
                        border: 'none',
                        color: '#f8fafc',
                        cursor: 'pointer',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                    >
                      <KeyRound style={{ width: '15px', height: '15px', color: '#10b981' }} />
                      <span>Compliance Auditor (Read-Only)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Live IBM App ID Login Button */}
              <a
                href="/api/auth/login"
                className="btn-primary"
                style={{ fontSize: '0.82rem', padding: '8px 16px' }}
              >
                <KeyRound style={{ width: '15px', height: '15px' }} />
                <span>IBM App ID Login</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
