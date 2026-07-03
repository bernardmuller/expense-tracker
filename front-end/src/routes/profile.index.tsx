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
    toast.success('Categories and budgets refreshed')
  }

  return (
    <>
      <AppHeader.Root>
        <AppHeader.Left>
          <AppHeader.Back onBack={() => router.history.back()} />
        </AppHeader.Left>
        <AppHeader.Center>
          <AppHeader.Title>Profile</AppHeader.Title>
        </AppHeader.Center>
        <AppHeader.Right>
          <ThemeToggle />
        </AppHeader.Right>
      </AppHeader.Root>

      <Layout>
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-muted-foreground text-sm">Name</p>
              <p className="text-foreground font-medium break-words">
                {user.name}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Email</p>
              <p className="text-foreground font-medium break-all">
                {user.email}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-foreground font-medium">
                  Budget Preferences
                </p>
                <p className="text-muted-foreground text-sm">
                  Frequency and start date
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/profile/preferences">Manage</Link>
              </Button>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-foreground font-medium">
                  Recurring Expenses
                </p>
                <p className="text-muted-foreground text-sm">
                  Subscriptions and recurring bills
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/profile/recurring-expenses">Manage</Link>
              </Button>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-foreground font-medium">Streak</p>
                <p className="text-muted-foreground text-sm">
                  Your daily app activity
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/profile/streak">View</Link>
              </Button>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-foreground font-medium">Penny Bot</p>
                <p className="text-muted-foreground text-sm">
                  Log expenses via Telegram
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/profile/penny-bot">Manage</Link>
              </Button>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-foreground font-medium">Notifications</p>
                <p className="text-muted-foreground text-sm">
                  Reminders and alerts
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/profile/notifications">Manage</Link>
              </Button>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-foreground font-medium">Refresh data</p>
                <p className="text-muted-foreground text-sm">
                  Reload categories and budgets from the server
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleClearCategoriesCache}
                aria-label="Refresh categories and budgets"
              >
                Refresh
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
