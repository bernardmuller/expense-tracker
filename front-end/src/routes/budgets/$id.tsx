import { Layout } from '@/components/layouts/Layout'
import { Button } from '@/components/ui/button'
import { createFileRoute, Outlet, useRouter } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'

export const Route = createFileRoute('/budgets/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  return (
    <Layout>
      <Button
        variant="outline"
        onClick={() => router.history.back()}
        className="aspect-square h-12 rounded-full"
      >
        <ArrowLeftIcon />
      </Button>
      <Outlet />
    </Layout>
  )
}
