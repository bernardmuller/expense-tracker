import { useNavigate } from '@tanstack/react-router'
import AppLayout from '../../AppLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function OnboardingWelcomePage() {
  const navigate = useNavigate()

  const handleGetStarted = () => {
    navigate({ to: '/onboarding/categories' })
  }

  return (
    <AppLayout
      title="Welcome to Expense Tracker"
      subtitle="Let's set up your account"
    >
      <div className="max-w-md mx-auto space-y-6 py-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold mb-2">Welcome!</h1>
          <p className="text-muted-foreground">
            Let's get you set up to start tracking your expenses and managing your budget effectively.
          </p>
        </div>

        <Card>
          <CardContent className='py-2'>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold">1</span>
                </div>
                <div>
                  <p className="font-medium">Choose your categories</p>
                  <p className="text-sm text-muted-foreground">Select the spending categories that fit your lifestyle</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold">2</span>
                </div>
                <div>
                  <p className="font-medium">Set your budget amount</p>
                  <p className="text-sm text-muted-foreground">Enter your total budget for the period</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold">3</span>
                </div>
                <div>
                  <p className="font-medium">Allocate to categories</p>
                  <p className="text-sm text-muted-foreground">Distribute your budget across spending categories</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold">4</span>
                </div>
                <div>
                  <p className="font-medium">Start tracking expenses</p>
                  <p className="text-sm text-muted-foreground">Begin logging your daily expenses and monitor your spending</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleGetStarted}
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-medium py-3"
        >
          Get Started
        </Button>
      </div>
    </AppLayout>
  )
}
