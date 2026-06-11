'use client';

/**
 * Hooks for requiring a signed-in admin and restoring the session on load.
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from './auth.store';
import { refreshTokens } from '@/lib/api/auth.api';

export function useAuth() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  return { accessToken, isAuthenticated, setAccessToken, clearAuth };
}

export function useRequireAdmin() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(false);
      return;
    }

    refreshTokens()
      .then(({ accessToken }) => {
        setAccessToken(accessToken);
        setIsLoading(false);
      })
      .catch(() => {
        router.push('/admin/login');
      });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isLoading };
}
