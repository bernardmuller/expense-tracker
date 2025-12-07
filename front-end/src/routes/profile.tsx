import { Layout } from '@/components/layouts/Layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/auth/auth-provider'
import { requireAuth } from '@/lib/auth/route-guard'
import { getUserByIdQueryOptions } from '@/lib/http/queries/users/getUserById'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'

export const Route = createFileRoute('/profile')({
  beforeLoad: () => requireAuth(),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getUserByIdQueryOptions())
  },
  component: ProfilePage,
})

function ProfilePage() {
  const router = useRouter()
  const { data: user } = useSuspenseQuery(getUserByIdQueryOptions())
  const { logout } = useAuth()

  return (
    <Layout>
      <Button
        variant="outline"
        onClick={() => router.history.back()}
        className="aspect-square h-12 rounded-full"
      >
        <ArrowLeftIcon />
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-muted-foreground text-sm">Name</p>
            <p className="text-foreground font-medium">{user.name}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Email</p>
            <p className="text-foreground font-medium">{user.email}</p>
          </div>
        </CardContent>
      </Card>
      <Button variant="destructive" onClick={logout} className="w-full">
        Logout
      </Button>
    </Layout>
  )
}
