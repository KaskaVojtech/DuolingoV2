interface LoginFormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export function LoginFormField({ label, error, children }: LoginFormFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-admin-sm text-admin-text-muted">{label}</label>
      {children}
      {error && (
        <p className="text-admin-danger text-admin-xs mt-admin-xs">{error}</p>
      )}
    </div>
  );
}
