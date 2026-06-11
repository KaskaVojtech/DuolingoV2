'use client';

/**
 * useRequireUser hook — ensures the user is signed in and restores the session.
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserAuthStore } from './user-auth.store';
import { userRefresh } from './user-auth.api';

export function useRequireUser() {
  const isAuthenticated = useUserAuthStore((s) => s.isAuthenticated);
  const setAccessToken = useUserAuthStore((s) => s.setAccessToken);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) { setIsLoading(false); return; }
    userRefresh()
      .then(({ accessToken }) => { setAccessToken(accessToken); setIsLoading(false); })
      .catch(() => { router.push('/login'); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isLoading };
}
