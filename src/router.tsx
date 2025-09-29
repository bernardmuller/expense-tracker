import { createRouter as createTanstackRouter } from '@tanstack/react-router'
// import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import * as TanstackQuery from './integrations/tanstack-query/root-provider'

import { routeTree } from './routeTree.gen'

export const createRouter = () => {
  const rqContext = TanstackQuery.getContext()

  const router = createTanstackRouter({
    routeTree,
    context: { ...rqContext },
    defaultPreload: false,
    defaultStaleTime: 0,
    Wrap: (props: { children: React.ReactNode }) => {
      return (
        <TanstackQuery.Provider {...rqContext}>
          {props.children}
        </TanstackQuery.Provider>
      )
    },
  })

  // Temporarily disable SSR query integration
  // if (typeof window !== 'undefined') {
  //   setupRouterSsrQueryIntegration({ router, queryClient: rqContext.queryClient })
  // }

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
