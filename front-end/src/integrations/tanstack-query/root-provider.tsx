import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { persistQueryClient } from '@tanstack/query-persist-client-core'
import { createPersister } from './persister'

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 24 * 60 * 60 * 1000, // 24 hours
        refetchOnWindowFocus: 'always',
        refetchOnReconnect: 'always',
        retry: 1,
        refetchOnMount: true,
      },
      mutations: {
        // Retry mutations once
        retry: 1,
      },
    },
  })

  persistQueryClient({
    queryClient,
    persister: createPersister(),
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    dehydrateOptions: {
      shouldDehydrateQuery: (query) => {
        return Array.isArray(query.queryKey) && query.queryKey[0] === 'categories'
      },
    },
  })

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
