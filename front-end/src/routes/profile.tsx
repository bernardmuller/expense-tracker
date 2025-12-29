import { Layout } from '@/components/layouts/Layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/lib/auth/auth-provider'
import { useTheme } from '@/components/providers/ThemeProvider'
import { requireAuth } from '@/lib/auth/route-guard'
import { getUserByIdQueryOptions } from '@/lib/http/queries/users/getUserById'
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { ArrowLeftIcon, LogOut } from 'lucide-react'
import { toast } from 'sonner'

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
  const { theme, setTheme } = useTheme()
  const queryClient = useQueryClient()

  const isDarkMode = theme === 'dark'

  const handleThemeToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light')
  }

  const handleClearCategoriesCache = () => {
    queryClient.removeQueries({ queryKey: ['categories'] })
    queryClient.removeQueries({ queryKey: ['budgets'] })
    toast.success('Cache cleared successfully')
  }

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => router.history.back()}
          className="aspect-square h-12 rounded-full"
        >
          <ArrowLeftIcon />
        </Button>
        <Button
          variant="destructive"
          onClick={logout}
          className="aspect-square h-12 rounded-full"
        >
          <LogOut />
        </Button>
      </div>
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
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">Theme</p>
              <p className="text-muted-foreground text-sm">
                {isDarkMode ? 'Dark' : 'Light'}
              </p>
            </div>
            <Switch checked={isDarkMode} onCheckedChange={handleThemeToggle} />
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
        </CardContent>
      </Card>
    </Layout>
  )
}
