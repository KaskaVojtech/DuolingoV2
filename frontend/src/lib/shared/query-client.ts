/**
 * Shared TanStack Query client instance.
 */
import { QueryClient } from '@tanstack/react-query';
import { useUIStore } from '@/lib/stores/ui.store';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error) => {
        const message = error instanceof Error ? error.message : 'Neznámá chyba';
        useUIStore.getState().showToast(message, 'error');
      },
    },
  },
});
