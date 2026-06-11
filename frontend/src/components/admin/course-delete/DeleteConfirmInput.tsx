'use client';

interface DeleteConfirmInputProps {
  courseTitle: string;
  value: string;
  onChange: (v: string) => void;
}

export function DeleteConfirmInput({ courseTitle, value, onChange }: DeleteConfirmInputProps) {
  const isValid = value === `delete ${courseTitle}`;

  return (
    <div className="mb-admin-lg flex flex-col gap-1">
      <label className="text-admin-sm text-admin-text-muted">
        Pro potvrzení napište: <code className="text-admin-text bg-admin-surface-2 px-1.5 py-0.5 rounded">delete {courseTitle}</code>
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`delete ${courseTitle}`}
        spellCheck={false}
        className={`delete-confirm-input w-full bg-admin-surface-2 border rounded-admin-sm px-admin-md py-2 text-admin-sm text-admin-text focus:outline-none transition-colors ${
          isValid ? 'delete-confirm-input--valid border-admin-danger' : 'border-admin-border focus:border-admin-primary'
        }`}
      />
    </div>
  );
}
