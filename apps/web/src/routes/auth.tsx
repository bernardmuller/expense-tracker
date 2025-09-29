import { createFileRoute } from '@tanstack/react-router'
import AuthPage from '../components/pages/auth/auth.page'

export const Route = createFileRoute('/auth')({
  component: () => {
    const { redirect } = Route.useSearch()
    return <AuthPage redirect={redirect} />
  },
  validateSearch: (search: Record<string, unknown>) => {
    return {
      redirect: (search.redirect as string) || '/',
    }
  },
})