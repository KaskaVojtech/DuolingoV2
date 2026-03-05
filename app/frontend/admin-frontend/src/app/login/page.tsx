'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import type { AuthMode } from '@/types/auth';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'email') {
        await authApi.loginEmail(email, password);
      } else {
        await authApi.loginCode(code);
      }
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.root}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Admin</h1>
          <p style={styles.subtitle}>Sign in to continue</p>
        </div>

        <div style={styles.toggle}>
          <button
            type="button"
            onClick={() => {
              setMode('email');
              setError('');
            }}
            style={{
              ...styles.toggleBtn,
              ...(mode === 'email' ? styles.toggleBtnActive : {}),
            }}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('code');
              setError('');
            }}
            style={{
              ...styles.toggleBtn,
              ...(mode === 'code' ? styles.toggleBtnActive : {}),
            }}
          >
            Access code
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {mode === 'email' ? (
            <>
              <div style={styles.field}>
                <label style={styles.label} htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  placeholder="you@example.com"
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label} htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  placeholder="••••••••"
                />
              </div>
            </>
          ) : (
            <div style={styles.field}>
              <label style={styles.label} htmlFor="code">
                Access code
              </label>
              <input
                id="code"
                type="text"
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{ ...styles.input, ...styles.monoInput }}
                placeholder="Enter your code"
              />
              <span style={styles.hint}>Case-sensitive</span>
            </div>
          )}

          {error && <p style={styles.error}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              ...(loading ? styles.submitBtnDisabled : {}),
            }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: '24px',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e5e5',
    padding: '40px',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    letterSpacing: '-0.025em',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '13px',
    color: '#737373',
  },
  toggle: {
    display: 'flex',
    borderBottom: '1px solid #e5e5e5',
    marginBottom: '28px',
  },
  toggleBtn: {
    flex: 1,
    padding: '8px 0',
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
    borderRadius: '0',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.15s',
    backgroundColor: '#ffffff',
  },
  monoInput: {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    letterSpacing: '0.05em',
  },
  hint: {
    fontSize: '11px',
    color: '#a3a3a3',
  },
  error: {
    fontSize: '13px',
    color: '#dc2626',
    padding: '10px 12px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
  },
  submitBtn: {
    width: '100%',
    padding: '11px',
    backgroundColor: '#000000',
    color: '#ffffff',
    border: 'none',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    letterSpacing: '0.01em',
    transition: 'opacity 0.15s',
    marginTop: '4px',
  },
  submitBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
};
