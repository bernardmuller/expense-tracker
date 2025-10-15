import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function LegacyCurrentBudget() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Current Budget</CardTitle>
            {/*Current Budget*/}
            <p className="text-muted-foreground text-sm">Budget - 01/09/2025</p>
          </div>
          {/*Needs to be a link*/}
          <Button variant="link" className="h-auto p-0 text-sm" asChild>
            <span>View</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-8 pt-4">
        <div className="relative text-center">
          {/*Needs onClick*/}
          <Button variant="ghost">
            <div className="flex justify-center">
              <div className="text-primary w-full text-4xl font-bold">
                {/*Current Amount*/}
                <span>R14 000</span>
              </div>
            </div>
          </Button>
          <div className="text-muted-foreground text-sm">
            {/*Remaining Amount*/}
            <span>remaining of R15000</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            {/*Spent Amount*/}
            <span className="text-muted-foreground">Spent: R12 000</span>
            {/*Spent Percentage*/}
            <span className="text-muted-foreground">15%</span>
          </div>
          <div className="bg-muted h-2 w-full rounded-full">
            {/*Replace with Progress lol*/}
            <div
              className={cn('h-2 rounded-full transition-all duration-300', {
                'bg-chart-1': 15 <= 75,
                'bg-chart-4': 15 > 75,
                'bg-destructive': 15 > 90,
              })}
              style={{ width: `${Math.min(15, 100)}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
