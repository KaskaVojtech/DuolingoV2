'use client';

import React from 'react';

interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hasError?: boolean;
}

export const AdminInput = React.forwardRef<HTMLInputElement, AdminInputProps>(
  ({ label, error, hasError, id, className = '', ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    const isError = hasError || !!error;
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-admin-sm font-semibold text-admin-text-muted">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`admin-field ${isError ? 'admin-field--error' : ''} ${className}`}
          {...props}
        />
        {error && (
          <p className="text-admin-xs text-admin-danger">{error}</p>
        )}
      </div>
    );
  }
);
AdminInput.displayName = 'AdminInput';
