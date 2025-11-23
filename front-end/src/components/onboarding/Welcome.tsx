import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { onboardingSteps } from '@/lib/constants/onboardingSteps'

type WelcomeProps = {
  onGetStarted: () => void
}

export default function Welcome({ onGetStarted }: WelcomeProps) {
  return (
    <div
      className="mx-auto flex max-w-md flex-1 flex-col justify-between
        space-y-6"
    >
      <div className="text-center">
        <div className="mb-4 text-6xl">🎉</div>
        <h1 className="mb-2 text-2xl font-bold">Welcome!</h1>
        <p className="text-muted-foreground">
          Let's get you set up to start tracking your expenses and managing your
          budget effectively.
        </p>
      </div>

      <Card>
        <CardContent className="py-2">
          <div className="space-y-6">
            {onboardingSteps.map((step, index) => (
              <div className="flex items-center gap-3">
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

      <Button className="w-full" onClick={onGetStarted}>
        Get Started
      </Button>
    </div>
  )
}
