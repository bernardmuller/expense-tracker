import { Suspense } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'

import { AppHeader } from '@/components/app-header'
import { Layout } from '@/components/layouts/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { requireAuth } from '@/lib/auth/route-guard'
import { getNotificationPreferencesQueryOptions } from '@/lib/http/queries/notification-preferences/getNotificationPreferences'
import { useUpdateNotificationPreference } from '@/lib/http/hooks/use-update-notification-preference'

const NOTIFICATION_LABELS: Record<
  string,
  { title: string; description: string }
> = {
  'activity-reminder': {
    title: 'Activity Reminder',
    description: 'Daily reminder to log your expenses.',
  },
}

export const Route = createFileRoute('/profile/notifications')({
  beforeLoad: () => requireAuth(),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      getNotificationPreferencesQueryOptions(),
    )
  },
  component: NotificationsProfilePage,
})

function NotificationsProfilePage() {
  const router = useRouter()

  return (
    <>
      <AppHeader.Root>
        <AppHeader.Left>
          <AppHeader.Back onBack={() => router.history.back()} />
        </AppHeader.Left>
        <AppHeader.Center>
          <AppHeader.Title>Notifications</AppHeader.Title>
        </AppHeader.Center>
        <AppHeader.Right>
          <ThemeToggle />
        </AppHeader.Right>
      </AppHeader.Root>
      <Layout>
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-24 w-full" />}>
              <NotificationPreferencesList />
            </Suspense>
          </CardContent>
        </Card>
      </Layout>
    </>
  )
}

function NotificationPreferencesList() {
  const { data: preferences } = useSuspenseQuery(
    getNotificationPreferencesQueryOptions(),
  )
  const updateMutation = useUpdateNotificationPreference()

  if (preferences.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No notification preferences yet.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {preferences.map((pref) => {
        const label = NOTIFICATION_LABELS[pref.type] ?? {
          title: pref.type,
          description: '',
        }

        return (
          <div
            key={pref.id}
            className="flex items-center justify-between gap-4"
          >
            <div>
              <p className="text-foreground font-medium">{label.title}</p>
              {label.description ? (
                <p className="text-muted-foreground text-sm">
                  {label.description}
                </p>
              ) : null}
            </div>
            <Switch
              checked={pref.enabled}
              disabled={updateMutation.isPending}
              onCheckedChange={(checked) =>
                updateMutation.mutate({
                  id: pref.id,
                  body: { enabled: checked },
                })
              }
            />
          </div>
        )
      })}
    </div>
  )
}
