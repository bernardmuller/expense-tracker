import { useQuery } from '@tanstack/react-query'
import { authClient } from '@/lib/auth-client'

export function useSession() {
  return useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      // Return null during SSR
      if (typeof window === 'undefined') {
        return null
      }
      return await authClient.getSession()
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}