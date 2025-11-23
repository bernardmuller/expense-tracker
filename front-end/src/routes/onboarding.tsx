import OnboardingLayout from '@/components/onboarding/OnboardingLayout'
import Welcome from '@/components/onboarding/Welcome'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { FieldGroup } from '@/components/ui/field'
import { Progress } from '@/components/ui/progress'
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
import { useAppForm } from '@/hooks/form'
import { onboardingSteps } from '@/lib/constants/onboardingSteps'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Check, LoaderCircleIcon } from 'lucide-react'
import { useState, useMemo } from 'react'
import z from 'zod'

const onboardingFormSchema = z.object({
  name: z
    .string()
    .min(1, 'You must provide a budget name')
    .max(50, "Budget name can't exceed 50 characters"),
  startAmount: z.number().positive('You must provide a budget amount'),
  categories: z.array(
    z.object({
      categoryId: z.string(),
      amount: z.number().positive('Amount must be greater than 0'),
    }),
  ),
})

export type OnboardingFormValues = z.infer<typeof onboardingFormSchema>

export const Route = createFileRoute('/onboarding')({
  component: OnboardingPage,
})

const StepHeader = ({
  title,
  description,
}: {
  title: string
  description: string
}) => {
  return (
    <div>
      <h3>{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  )
}

function OnboardingPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)

  const categories = [
    {
      icon: '🦚',
      value: 'thing',
      name: 'thing',
    },
  ]

  const form = useAppForm<OnboardingFormValues>({
    defaultValues: {
      name: '',
      startAmount: 0,
      categories: [],
    },
    validators: {
      onSubmit: onboardingFormSchema,
    },
    onSubmit: ({ value }) => {
      // Final submission - save to backend
      console.log('Final onboarding data:', value)
      // TODO: Save to backend and mark user as onboarded
      // TODO: Get userId from auth context
      navigate({ to: '/' })
    },
  })

  const toggleCategory = (categoryId: string) => {
    const currentCategories = form.state.values.categories
    const isSelected = currentCategories.some(
      (cat) => cat.categoryId === categoryId,
    )

    if (isSelected) {
      form.setFieldValue(
        'categories',
        currentCategories.filter((cat) => cat.categoryId !== categoryId),
      )
    } else {
      form.setFieldValue('categories', [
        ...currentCategories,
        { categoryId, amount: 0 },
      ])
    }
  }

  // Helper to get category name from value
  const getCategoryName = (categoryId: string) => {
    return (
      categories.find((cat) => cat.value === categoryId)?.name || categoryId
    )
  }

  // Calculate total allocated amount
  const totalAllocated = useMemo(() => {
    return form.state.values.categories.reduce((sum, category) => {
      return sum + (category.amount || 0)
    }, 0)
  }, [form.state.values.categories])

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-ZA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  if (currentStep === 0) {
    return (
      <OnboardingLayout>
        <Welcome onGetStarted={() => setCurrentStep(1)} />
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
          <StepperContent
            value={1}
            className="flex flex-1 items-center justify-center"
          >
            <div className="w-full space-y-4">
              <StepHeader
                title="Setup your Budget"
                description={onboardingSteps[currentStep - 1].description}
              />
              <FieldGroup>
                <form.AppField
                  name="name"
                  children={(field) => (
                    <field.TextField placeholder="Budget name (e.g., Monthly Budget)" />
                  )}
                />
                <form.AppField
                  name="startAmount"
                  children={(field) => (
                    <field.NumberField placeholder="Total budget amount" />
                  )}
                />
              </FieldGroup>
            </div>
          </StepperContent>
          <StepperContent
            value={2}
            className="flex flex-1 items-center justify-center"
          >
            <div className="w-full space-y-4">
              <StepHeader
                title="Select Your Categories"
                description={onboardingSteps[currentStep - 1].description}
              />
              <div className="grid gap-3">
                {categories.map((category) => {
                  const isChecked = form.state.values.categories.some(
                    (cat) => cat.categoryId === category.value,
                  )
                  return (
                    <Card>
                      <CardContent>
                        <label
                          key={category.value}
                          className="flex cursor-pointer items-center gap-3"
                        >
                          <div className="flex flex-1 gap-1 font-medium">
                            <span>{category.icon}</span>
                            <span>{category.name}</span>
                          </div>
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() =>
                              toggleCategory(category.value)
                            }
                          />
                        </label>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </StepperContent>
          <StepperContent
            value={3}
            className="flex flex-1 flex-col items-center justify-center
              space-y-4"
          >
            <div className="w-full max-w-2xl space-y-4">
              <StepHeader
                title="Allocate Your Categories"
                description={onboardingSteps[currentStep - 1].description}
              />
              <Card>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex w-full gap-3">
                      <span className="text-lg font-semibold">
                        R{formatCurrency(totalAllocated)}
                      </span>
                      <span className="text-muted-foreground text-lg">of</span>
                      <span className="text-lg font-semibold">
                        R{formatCurrency(form.state.values.startAmount)}
                      </span>
                    </div>
                    <Progress
                      value={
                        (totalAllocated / form.state.values.startAmount) * 100
                      }
                    />
                    <p className="text-muted-foreground mt-1 text-sm">
                      Allocate an amount you plan on spending on each category
                    </p>
                  </div>
                </CardContent>
              </Card>
              <div className="space-y-3">
                {form.state.values.categories.map((category, index) => (
                  <Card key={category.categoryId}>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <p className="font-medium">
                            {getCategoryName(category.categoryId)}
                          </p>
                        </div>
                        <div className="w-36">
                          <form.AppField
                            name={`categories[${index}].amount`}
                            children={(field) => (
                              <div className="flex items-center gap-1">
                                <span className="text-sm text-gray-400">R</span>
                                <field.NumberField placeholder="0" />
                              </div>
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </StepperContent>
        </StepperPanel>
      </Stepper>
      <div className="flex items-center justify-between gap-2.5">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((prev) => prev - 1)}
        >
          Previous
        </Button>
        {currentStep !== onboardingSteps.length ? (
          <Button
            onClick={() => setCurrentStep((prev) => prev + 1)}
            disabled={currentStep === onboardingSteps.length}
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={() => form.handleSubmit()}
            disabled={form.state.isSubmitting}
          >
            {form.state.isSubmitting ? (
              <>
                <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
                Creating Budget...
              </>
            ) : (
              'Create Budget'
            )}
          </Button>
        )}
      </div>
    </OnboardingLayout>
  )
}
