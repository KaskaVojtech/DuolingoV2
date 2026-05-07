'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { AuthApi } from '@/lib/api/auth.api';

interface EmailSentModalProps {
  isOpen: boolean;
  email: string;
  onClose: () => void;
  onWrongEmail: () => void;
}

export const EmailSentModal: React.FC<EmailSentModalProps> = ({
  isOpen,
  email,
  onClose,
  onWrongEmail,
}) => {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    setResending(true);
    try {
      await AuthApi.register({ email, password: 'placeholder', confirmPassword: 'placeholder' });
    } catch {
      // backend vrátí error ale email se pošle znovu pokud je PENDING
    } finally {
      setResending(false);
      setResent(true);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <p className="auth-tag">Ověření emailu</p>
      <h2 className="modal-title">Zkontrolujte svůj email</h2>
      <p className="modal-subtitle">
        Odeslali jsme odkaz na{' '}
        <span className="modal-email">{email}</span>
      </p>

      {resent && (
        <div className="alert alert-success">Email byl znovu odeslán.</div>
      )}

      <div className="modal-actions">
        <Button
          variant="pink"
          fullWidth
          loading={resending}
          onClick={handleResend}
        >
          Poslat ještě jednou
        </Button>

        <p className="modal-link">
          Není to váš email?{' '}
          <span onClick={onWrongEmail}>
            Registrovat se s jiným emailem
          </span>
        </p>
      </div>
    </Modal>
  );
};
