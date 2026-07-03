import { Suspense } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'

import { AppHeader } from '@/components/app-header'
import { Layout } from '@/components/layouts/Layout'
import { Skeleton } from '@/components/ui/skeleton'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { StreakGraph } from '@/components/streak-graph'
import { requireAuth } from '@/lib/auth/route-guard'
import { getUserIdFromAccessToken } from '@/lib/auth/decode-token'
import {
  getUserStreakQueryOptions,
  transformStreakToWeeks,
} from '@/lib/http/queries/streak/getUserStreak'

export const Route = createFileRoute('/profile/streak')({
  beforeLoad: () => requireAuth(),
  loader: async ({ context }) => {
    const userIdResult = getUserIdFromAccessToken()
    if (userIdResult.isErr()) return
    await context.queryClient.ensureQueryData(
      getUserStreakQueryOptions(userIdResult.value),
    )
  },
  component: StreakProfilePage,
})

function StreakProfilePage() {
  const router = useRouter()
  const userIdResult = getUserIdFromAccessToken()

  return (
    <>
      <AppHeader.Root>
        <AppHeader.Left>
          <AppHeader.Back onBack={() => router.history.back()} />
        </AppHeader.Left>
        <AppHeader.Center>
          <AppHeader.Title>Streak</AppHeader.Title>
        </AppHeader.Center>
        <AppHeader.Right>
          <ThemeToggle />
        </AppHeader.Right>
      </AppHeader.Root>
      <Layout>
        {userIdResult.isOk() ? (
          <Suspense fallback={<Skeleton className="h-56 w-full rounded-xl" />}>
            <StreakOverview userId={userIdResult.value} />
          </Suspense>
        ) : (
          <p className="text-muted-foreground text-sm">
            Unable to load your streak.
          </p>
        )}
      </Layout>
    </>
  )
}

function StreakOverview({ userId }: { userId: string }) {
  const { data } = useSuspenseQuery(getUserStreakQueryOptions(userId))
  const weeks = transformStreakToWeeks(data)

  return (
    <StreakGraph.Root>
      <StreakGraph.Header>
        <StreakGraph.Title>Activity</StreakGraph.Title>
        <StreakGraph.Subtitle>
          Every day you open the app keeps your streak alive.
        </StreakGraph.Subtitle>
      </StreakGraph.Header>

      <StreakGraph.Stats>
        <StreakGraph.Stat label="Current streak" value={data.currentStreak} />
        <StreakGraph.Stat label="Longest streak" value={data.longestStreak} />
        <StreakGraph.Stat label="Active days" value={data.totalActiveDays} />
      </StreakGraph.Stats>

      <StreakGraph.Graph weeks={weeks} />
      <StreakGraph.Legend className="justify-end" />
    </StreakGraph.Root>
  )
}
