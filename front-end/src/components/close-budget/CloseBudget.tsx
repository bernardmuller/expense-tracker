import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { onboardingSteps } from '@/lib/constants/onboardingSteps'
import { Separator } from '../ui/separator'

type CloseBudgetProps = {
  onGetStarted: () => void
}

export default function CloseBudget({ onGetStarted }: CloseBudgetProps) {
  return (
    <div
      className="mx-auto flex max-w-md flex-1 flex-col justify-between
        space-y-6"
    >
      <div className="space-y-4">
        <div className="text-center">
          <div className="mb-4 text-6xl">💸</div>
          <h1 className="mb-2 text-2xl font-bold">Budget Transition</h1>
        </div>
        <Card>
          <CardHeader>
            <div className="w-full">
              <h3 className="text-lg">Create new Budget</h3>
              <p className="text-muted-foreground text-sm">
                You are about to close your current budget and start a new one.
              </p>
            </div>
            <Separator className="mt-4" />
          </CardHeader>
          <CardContent className="py-2">
            <div className="space-y-6">
              {onboardingSteps.map((step, index) => (
                <div key={step.title} className="flex items-center gap-3">
                  <div
                    className="bg-primary/10 flex min-h-8 min-w-8 items-center
                      justify-center rounded-full"
                  >
                    <span className="text-primary font-semibold">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{step.title}</p>
                    <p className="text-muted-foreground text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Button className="w-full" onClick={onGetStarted}>
        Continue
      </Button>
    </div>
  )
}
