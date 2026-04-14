import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <Link href="/" className="navbar-logo">
        Lucy<span>&apos;s</span> English
      </Link>
      <div className="navbar-actions">
        <Link href="/login">
          <Button variant="outline">Přihlásit se</Button>
        </Link>
        <Link href="/register">
          <Button variant="pink">Registrovat se</Button>
        </Link>
      </div>
    </nav>
  );
};
