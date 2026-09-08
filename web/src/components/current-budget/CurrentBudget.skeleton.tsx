import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '../ui/skeleton'

export function CurrentBudgetSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Budget</CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-24" />
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <Skeleton className="h-12 w-32" />
        <Skeleton className="mt-2 h-3 w-40" />
      </CardContent>
      <CardFooter className="flex flex-col gap-1">
        <div className="flex w-full justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-2 w-full" />
      </CardFooter>
    </Card>
  )
}
