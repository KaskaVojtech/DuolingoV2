'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { AuthApi } from '@/lib/api/auth.api';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await AuthApi.login({ email, password });
      // po přihlášení zkontroluj roli a přesměruj
      const me = await AuthApi.getMe();
      if (me.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div>
        <h2 className="auth-form-title">Přihlásit se</h2>
        <p className="auth-form-sub">Vítejte zpět</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <Input
        label="Email"
        type="email"
        placeholder="vas@email.cz"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Input
        label="Heslo"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Button type="submit" variant="blue" fullWidth loading={loading}>
        Přihlásit se
      </Button>

      <p className="auth-bottom-link">
        Nemáte účet? <a href="/register">Zaregistrujte se</a>
      </p>
    </form>
  );
};
