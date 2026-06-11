import Link from 'next/link';
import { Fragment } from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 mb-admin-md">
      {items.map((item, i) => (
        <Fragment key={item.label}>
          {i > 0 && (
            <i className="ti ti-chevron-right text-admin-xs text-admin-text-muted" aria-hidden="true" />
          )}
          {item.href ? (
            <Link href={item.href} className="text-admin-sm text-admin-text-muted hover:text-admin-text transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-admin-sm font-bold text-admin-text" aria-current="page">
              {item.label}
            </span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
