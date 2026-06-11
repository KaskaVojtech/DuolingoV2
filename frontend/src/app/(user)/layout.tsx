'use client';

/**
 * User-side layout with the TanStack Query provider.
 */

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/shared/query-client';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
