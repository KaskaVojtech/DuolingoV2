import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="input-wrapper">
      <label className="input-label">{label}</label>
      <input
        className={`input-field ${error ? 'error' : ''} ${className}`}
        {...props}
      />
      {error && <span className="alert alert-error">{error}</span>}
    </div>
  );
};
