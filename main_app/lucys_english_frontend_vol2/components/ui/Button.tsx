import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'pink' | 'blue' | 'outline';
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'pink',
  fullWidth = false,
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const variantClass = `btn-${variant}`;
  const fullClass = fullWidth ? 'btn-full' : '';

  return (
    <button
      className={`btn ${variantClass} ${fullClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Načítání...' : children}
    </button>
  );
};
