interface AdminErrorBannerProps {
  message: string | null;
}

export function AdminErrorBanner({ message }: AdminErrorBannerProps) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2 bg-admin-danger-bg border border-admin-danger text-admin-danger rounded-admin-sm p-admin-md text-admin-sm">
      <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
      <span>{message}</span>
    </div>
  );
}
