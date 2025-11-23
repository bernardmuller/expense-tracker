import OnboardingLayout from '@/components/onboarding/OnboardingLayout'
import Welcome from '@/components/onboarding/Welcome'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { FieldGroup } from '@/components/ui/field'
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
import { useState } from 'react'
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

function OnboardingPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)

  const categories = [
    {
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
          </StepperContent>
          <StepperContent
            value={2}
            className="flex flex-1 items-center justify-center"
          >
            <Card>
              <CardHeader>
                <CardTitle>Select Your Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    Choose the expense categories you want to track in your
                    budget.
                  </p>
                  <div className="grid gap-3">
                    {categories.map((category) => {
                      const isChecked = form.state.values.categories.some(
                        (cat) => cat.categoryId === category.value,
                      )
                      return (
                        <label
                          key={category.value}
                          className="hover:bg-muted/50 flex cursor-pointer
                            items-center gap-3 rounded-md border p-3"
                        >
                          <span className="flex-1 font-medium">
                            {category.name}
                          </span>
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() =>
                              toggleCategory(category.value)
                            }
                          />
                        </label>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </StepperContent>
          <StepperContent
            value={3}
            className="flex flex-1 items-center justify-center"
          >
            <Card>
              <CardHeader>
                <CardTitle>Allocate Your Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    Set a budget amount for each category you selected.
                  </p>
                  <FieldGroup>
                    {form.state.values.categories.map((category, index) => (
                      <form.AppField
                        key={category.categoryId}
                        name={`categories[${index}].amount`}
                        children={(field) => (
                          <field.NumberField
                            label={getCategoryName(category.categoryId)}
                            placeholder="Enter amount"
                          />
                        )}
                      />
                    ))}
                  </FieldGroup>
                </div>
              </CardContent>
            </Card>
          </StepperContent>
        </StepperPanel>
      </Stepper>
      <div className="flex items-center justify-between gap-2.5">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((prev) => prev - 1)}
          disabled={currentStep === 1}
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
    </OnboardingLayout>
  )
}
