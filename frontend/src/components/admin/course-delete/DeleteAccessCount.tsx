interface DeleteAccessCountProps {
  activeCount: number;
  totalCount: number;
}

export function DeleteAccessCount({ activeCount, totalCount }: DeleteAccessCountProps) {
  return (
    <div className="flex flex-col gap-admin-sm mb-admin-lg">
      <div className="flex gap-admin-md">
        <div className="flex-1 bg-admin-surface border border-admin-border rounded-admin-md p-admin-md">
          <p className={`text-admin-2xl font-bold ${activeCount > 0 ? 'text-admin-danger' : 'text-[#2db868]'}`}>
            {activeCount}
          </p>
          <p className="text-admin-xs text-admin-text-muted">aktivních přístupů</p>
        </div>
        <div className="flex-1 bg-admin-surface border border-admin-border rounded-admin-md p-admin-md">
          <p className="text-admin-2xl font-bold text-admin-text-muted">{totalCount}</p>
          <p className="text-admin-xs text-admin-text-muted">přístupů celkem</p>
        </div>
      </div>
      {activeCount > 0 ? (
        <p className="text-admin-xs text-admin-danger">Po smazání ztratí všichni uživatelé přístup okamžitě.</p>
      ) : (
        <p className="text-admin-xs text-[#2db868]">Žádní aktivní uživatelé.</p>
      )}
    </div>
  );
}
