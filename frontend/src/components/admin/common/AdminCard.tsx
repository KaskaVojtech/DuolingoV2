interface AdminCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminCard({ children, className = '' }: AdminCardProps) {
  return (
    <div className={`admin-card p-admin-xl ${className}`}>
      {children}
    </div>
  );
}
