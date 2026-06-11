interface FallbackProps {
  error: Error | null;
  onReset: () => void;
}

export function AdminErrorFallback({ error, onReset }: FallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-admin-lg p-admin-2xl">
      <i className="ti ti-alert-triangle text-admin-danger" style={{ fontSize: 48 }} />
      <h2 className="text-admin-xl text-admin-text">Něco se pokazilo</h2>
      <p className="text-admin-sm text-admin-text-muted text-center max-w-md">
        {error?.message ?? 'Neočekávaná chyba. Zkuste obnovit stránku.'}
      </p>
      <div className="flex gap-admin-sm">
        <button onClick={onReset} className="text-admin-sm text-admin-text">Zkusit znovu</button>
        <button onClick={() => window.location.reload()} className="text-admin-sm text-admin-text">Obnovit stránku</button>
      </div>
    </div>
  );
}
