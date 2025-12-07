import { Layout } from '@/components/layouts/Layout'
import { Button } from '@/components/ui/button'
import { createFileRoute, Outlet, useRouter } from '@tanstack/react-router'
import { ArrowLeftIcon, CalendarPlus } from 'lucide-react'

export const Route = createFileRoute('/budgets/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  return (
    <Layout>
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => router.history.back()}
          className="aspect-square h-12 rounded-full"
        >
          <ArrowLeftIcon />
        </Button>
        <Button
          variant="outline"
          onClick={() => router.navigate({ to: '/budgets/new' })}
          className="aspect-square h-12 rounded-full"
        >
          <CalendarPlus />
        </Button>
      </div>
      <Outlet />
    </Layout>
  )
}
