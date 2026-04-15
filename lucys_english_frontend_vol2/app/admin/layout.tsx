import React from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <Link href="/" className="navbar-logo">
            Lucy<span>&apos;s</span>
          </Link>
          <span className="admin-sidebar-tag">Admin</span>
        </div>

        <nav className="admin-nav">
          <p className="admin-nav-label">Obsah</p>
          <Link href="/admin" className="admin-nav-item">
            <span>🏠</span> Dashboard
          </Link>
          <Link href="/admin/lessons" className="admin-nav-item">
            <span>📚</span> Lekce
          </Link>
          <Link href="/admin/courses" className="admin-nav-item">
            <span>🎓</span> Kurzy
          </Link>
          <Link href="/admin/users" className="admin-nav-item">
            <span>👥</span> Uživatelé
          </Link>
        </nav>
      </aside>

      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
