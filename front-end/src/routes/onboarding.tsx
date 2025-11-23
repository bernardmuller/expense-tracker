import OnboardingLayout from '@/components/onboarding/OnboardingLayout'
import Welcome from '@/components/onboarding/Welcome'
import { Button } from '@/components/ui/button'
import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@/components/ui/stepper'
import { onboardingSteps } from '@/lib/constants/onboardingSteps'
import { createFileRoute } from '@tanstack/react-router'
import { Check, LoaderCircleIcon } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/onboarding')({
  component: OnboardingPage,
})

function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)

  if (currentStep === 0) {
    return (
      <OnboardingLayout>
        <Welcome onGetStarted={() => setCurrentStep((prev) => prev + 1)} />
      </OnboardingLayout>
    )
  }

  return (
    <OnboardingLayout>
      <Stepper
        value={currentStep}
        onValueChange={setCurrentStep}
        indicators={{
          completed: <Check className="size-4" />,
          loading: <LoaderCircleIcon className="size-4 animate-spin" />,
        }}
        className="flex h-full flex-col space-y-8"
      >
          <StepperNav>
            {onboardingSteps.map((step, index) => (
              <StepperItem
                key={index}
                step={index + 1}
                className="relative flex-1 items-start"
              >
                <StepperTrigger className="flex flex-col gap-2.5">
                  <StepperIndicator>{index + 1}</StepperIndicator>
                  <StepperTitle>{step.title}</StepperTitle>
                </StepperTrigger>
                {onboardingSteps.length > index + 1 && (
                  <StepperSeparator
                    className="group-data-[state=completed]/step:bg-primary
                      absolute inset-x-0 top-3 left-[calc(50%+0.875rem)] m-0
                      group-data-[orientation=horizontal]/stepper-nav:w-[calc(100%-2rem+0.225rem)]
                      group-data-[orientation=horizontal]/stepper-nav:flex-none"
                  />
                )}
              </StepperItem>
            ))}
          </StepperNav>
          <StepperPanel className="h-full flex-1 text-sm">
            {onboardingSteps.map((step, index) => (
              <StepperContent
                key={index}
                value={index + 1}
                className="flex flex-1 items-center justify-center"
              >
                {step.title}
              </StepperContent>
            ))}
          </StepperPanel>
          <div className="flex items-center justify-between gap-2.5">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((prev) => prev - 1)}
            >
              Previous
            </Button>
            <Button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              disabled={currentStep === onboardingSteps.length}
            >
              Next
            </Button>
          </div>
        </Stepper>
      </OnboardingLayout>
  )
}
