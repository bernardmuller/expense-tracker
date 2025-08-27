import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryClient } from '../../lib/query-client'
import type { QueryClient} from '@tanstack/react-query';

export function getContext() {
  const queryClient = createQueryClient()
  return {
    queryClient,
  }
}

export function Provider({
  children,
  queryClient,
}: {
  children: React.ReactNode
  queryClient: QueryClient
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
