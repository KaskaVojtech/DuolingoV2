'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import type { RegisterMode } from '@/types/auth';

type Status = { type: 'success' | 'error'; message: string } | null;

export default function DashboardPage() {
  const router = useRouter();
  const [mode, setMode] = useState<RegisterMode>('email');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  function resetForm() {
    setEmail('');
    setPassword('');
    setStatus(null);
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    try {
      if (mode === 'email') {
        await authApi.registerEmail(email, password);
        setStatus({ type: 'success', message: `User ${email} created successfully.` });
      } else {
        await authApi.registerCode();
        setStatus({ type: 'success', message: 'User created via access code.' });
      }
      resetForm();
    } catch (err) {
      setStatus({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to create user',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await authApi.logout();
    } finally {
      router.push('/login');
    }
  }

  return (
    <div style={styles.root}>
      <aside style={styles.sidebar}>
        <div style={styles.sidebarTop}>
          <h1 style={styles.brand}>Admin</h1>
          <nav style={styles.nav}>
            <span style={styles.navItemActive}>Users</span>
          </nav>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Sign out
        </button>
      </aside>

      <main style={styles.main}>
        <div style={styles.pageHeader}>
          <h2 style={styles.pageTitle}>Create user</h2>
          <p style={styles.pageSubtitle}>Add a new user to the system</p>
        </div>

        <div style={styles.toggle}>
          <button
            type="button"
            onClick={() => {
              setMode('email');
              setStatus(null);
            }}
            style={{
              ...styles.toggleBtn,
              ...(mode === 'email' ? styles.toggleBtnActive : {}),
            }}
          >
            Email + password
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('code');
              setStatus(null);
            }}
            style={{
              ...styles.toggleBtn,
              ...(mode === 'code' ? styles.toggleBtnActive : {}),
            }}
          >
            Access code
          </button>
        </div>

        <form onSubmit={handleCreate} style={styles.form}>
          {mode === 'email' ? (
            <>
              <div style={styles.field}>
                <label style={styles.label} htmlFor="new-email">
                  Email address
                </label>
                <input
                  id="new-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  placeholder="user@example.com"
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label} htmlFor="new-password">
                  Password
                </label>
                <input
                  id="new-password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  placeholder="Min. 8 characters"
                />
              </div>
            </>
          ) : (
            <div style={styles.codeInfo}>
              <p style={styles.codeInfoText}>
                A new user will be created with a system-generated access code. The code will be returned by the server.
              </p>
            </div>
          )}

          {status && (
            <div
              style={{
                ...styles.statusBox,
                ...(status.type === 'success' ? styles.statusSuccess : styles.statusError),
              }}
            >
              {status.message}
            </div>
          )}

          <div style={styles.actions}>
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.primaryBtn,
                ...(loading ? styles.btnDisabled : {}),
              }}
            >
              {loading ? 'Creating…' : 'Create user'}
            </button>
            {status?.type === 'success' && (
              <button type="button" onClick={resetForm} style={styles.secondaryBtn}>
                Create another
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#ffffff',
  },

  sidebar: {
    width: '200px',
    borderRight: '1px solid #e5e5e5',
    padding: '32px 20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexShrink: 0,
  },
  sidebarTop: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  brand: {
    fontSize: '15px',
    fontWeight: '600',
    letterSpacing: '-0.02em',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  navItemActive: {
    fontSize: '13px',
    fontWeight: '500',
    padding: '6px 10px',
    backgroundColor: '#f5f5f5',
    cursor: 'default',
  },
  logoutBtn: {
    background: 'none',
    border: 'none',
    padding: '0',
    fontSize: '13px',
    color: '#737373',
    cursor: 'pointer',
    textAlign: 'left',
  },

  main: {
    flex: 1,
    padding: '48px',
    maxWidth: '560px',
  },
  pageHeader: {
    marginBottom: '36px',
  },
  pageTitle: {
    fontSize: '22px',
    fontWeight: '600',
    letterSpacing: '-0.025em',
    marginBottom: '6px',
  },
  pageSubtitle: {
    fontSize: '13px',
    color: '#737373',
  },

  toggle: {
    display: 'flex',
    borderBottom: '1px solid #e5e5e5',
    marginBottom: '28px',
  },
  toggleBtn: {
    padding: '8px 16px 8px 0',
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    marginBottom: '-1px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    color: '#737373',
    transition: 'color 0.15s, border-color 0.15s',
  },
  toggleBtnActive: {
    color: '#000000',
    borderBottomColor: '#000000',
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '500',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: '#525252',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #e5e5e5',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#ffffff',
    transition: 'border-color 0.15s',
  },
  codeInfo: {
    padding: '16px',
    backgroundColor: '#f5f5f5',
    border: '1px solid #e5e5e5',
  },
  codeInfoText: {
    fontSize: '13px',
    color: '#525252',
    lineHeight: '1.6',
  },
  statusBox: {
    fontSize: '13px',
    padding: '12px 14px',
    border: '1px solid',
  },
  statusSuccess: {
    color: '#166534',
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  statusError: {
    color: '#991b1b',
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: '4px',
  },
  primaryBtn: {
    padding: '10px 20px',
    backgroundColor: '#000000',
    color: '#ffffff',
    border: 'none',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'opacity 0.15s',
  },
  secondaryBtn: {
    padding: '10px 20px',
    backgroundColor: 'transparent',
    color: '#000000',
    border: '1px solid #e5e5e5',
    fontSize: '14px',
    cursor: 'pointer',
  },
  btnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
};
