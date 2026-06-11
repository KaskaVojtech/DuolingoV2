'use client';

import React from 'react';

interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  loading?: boolean;
  icon?: string;
}

const variantClasses: Record<string, string> = {
  primary: 'admin-btn--primary',
  ghost:   'admin-btn--ghost',
  danger:  'admin-btn--danger',
};

const sizeClasses: Record<string, string> = {
  sm: 'admin-btn--sm',
  md: 'admin-btn--md',
};

export function AdminButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  disabled,
  className = '',
  ...props
}: AdminButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`admin-btn ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {loading ? (
        <i className="ti ti-loader-2 animate-spin text-[14px]" aria-hidden="true" />
      ) : icon ? (
        <i className={`ti ${icon} text-[14px]`} aria-hidden="true" />
      ) : null}
      {children}
    </button>
  );
}
