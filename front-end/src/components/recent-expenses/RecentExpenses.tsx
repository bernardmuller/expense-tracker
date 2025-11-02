import { Button } from '../ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '../ui/card'

export default function RecentExpenses({
  children,
  linkProvider: LinkProvider,
}: {
  children: React.ReactNode
  linkProvider: React.ComponentType<{ children: React.ReactNode }>
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Expenses</CardTitle>
        <CardAction>
          <Button variant="link" className="h-auto p-0 text-sm" asChild>
            <LinkProvider>View All</LinkProvider>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="divide-border divide-y">{children}</CardContent>
    </Card>
  )
}
