import { Breadcrumb, BreadcrumbItem } from './Breadcrumb';

interface AdminPageLayoutProps {
  title: string;
  breadcrumb?: BreadcrumbItem[];
  actions?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'full';
  children: React.ReactNode;
}

const maxWidthMap = {
  sm:   'max-w-[560px]',
  md:   'max-w-[860px]',
  lg:   'max-w-[1200px]',
  full: 'max-w-full',
};

export function AdminPageLayout({ title, breadcrumb, actions, maxWidth = 'full', children }: AdminPageLayoutProps) {
  return (
    <div className={`p-admin-2xl ${maxWidthMap[maxWidth]}`}>
      {breadcrumb && <Breadcrumb items={breadcrumb} />}
      <div className="flex items-center justify-between mb-admin-xl">
        <h1 className="text-admin-2xl font-extrabold tracking-tight text-admin-text">{title}</h1>
        {actions && <div className="flex gap-admin-sm">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
