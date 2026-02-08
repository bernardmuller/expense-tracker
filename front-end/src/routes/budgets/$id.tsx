import { Layout } from '@/components/layouts/Layout'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/budgets/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}
