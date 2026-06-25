import { AppHeader } from '@/components/app-header'
import { Layout } from '@/components/layouts/Layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useAuth } from '@/lib/auth/auth-provider'
import { requireAuth } from '@/lib/auth/route-guard'
import { getUserByIdQueryOptions } from '@/lib/http/queries/users/getUserById'
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useRouter, Link } from '@tanstack/react-router'
import { ArrowLeftIcon, LogOut } from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/profile/')({
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
  const queryClient = useQueryClient()

  const handleClearCategoriesCache = () => {
    queryClient.removeQueries({ queryKey: ['categories'] })
    queryClient.removeQueries({ queryKey: ['budgets'] })
    toast.success('Cache cleared successfully')
  }

  return (
    <>
      <AppHeader.Root>
        <AppHeader.Left>
          <AppHeader.Back onBack={() => router.history.back()} />
        </AppHeader.Left>
        <div />
        <AppHeader.Right>
          <ThemeToggle />
        </AppHeader.Right>
      </AppHeader.Root>

      <Layout>
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
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground font-medium">
                  Budget Preferences
                </p>
                <p className="text-muted-foreground text-sm">
                  Update frequency and start day
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/profile/preferences">Update</Link>
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground font-medium">
                  Recurring Expenses
                </p>
                <p className="text-muted-foreground text-sm">
                  Manage subscriptions and recurring bills
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/profile/recurring-expenses">Manage</Link>
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground font-medium">Penny Bot</p>
                <p className="text-muted-foreground text-sm">
                  Connect your Telegram account
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/profile/penny-bot">Configure</Link>
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground font-medium">Clear Cache</p>
                <p className="text-muted-foreground text-sm">
                  Remove all cached data
                </p>
              </div>
              <Button variant="outline" onClick={handleClearCategoriesCache}>
                Clear
              </Button>
            </div>
            <Separator />
            <Button variant="destructive" onClick={logout} className="w-full">
              Sign out
            </Button>
          </CardContent>
        </Card>
      </Layout>
    </>
  )
}
