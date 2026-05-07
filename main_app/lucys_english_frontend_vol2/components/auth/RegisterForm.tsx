'use client';

import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { AuthApi } from '@/lib/api/auth.api';
import { EmailSentModal } from './EmailSentModal';

export const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Hesla se neshodují');
      return;
    }

    setLoading(true);
    try {
      await AuthApi.register({ email, password, confirmPassword });
      setShowModal(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes('pending')) {
          setShowModal(true);
        } else {
          setError(err.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleWrongEmail = () => {
    setShowModal(false);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div>
          <h2 className="auth-form-title">Registrace</h2>
          <p className="auth-form-sub">Vytvořte si účet zdarma</p>
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

        <Input
          label="Zopakovat heslo"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <Button type="submit" variant="pink" fullWidth loading={loading}>
          Zaregistrovat se
        </Button>

        <p className="auth-bottom-link">
          Máte účet? <a href="/login">Přihlaste se</a>
        </p>
      </form>

      <EmailSentModal
        isOpen={showModal}
        email={email}
        onClose={() => setShowModal(false)}
        onWrongEmail={handleWrongEmail}
      />
    </>
  );
};
