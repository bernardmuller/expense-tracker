import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryClient } from '../../lib/query-client'
import type { QueryClient} from '@tanstack/react-query';

let globalQueryClient: QueryClient | undefined

export function getContext() {
  if (!globalQueryClient) {
    globalQueryClient = createQueryClient()
  }
  return {
    queryClient: globalQueryClient,
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
