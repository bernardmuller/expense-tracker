import AllocatableCategoryItem from '@/components/category-item/AllocatableCategoryItem'
import SelectableCategoryItem from '@/components/category-item/SelectableCategoryItem'
import OnboardingLayout from '@/components/onboarding/OnboardingLayout'
import Welcome from '@/components/onboarding/Welcome'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { useState } from 'react'
import z from 'zod'
import { formatCurrency } from '@/lib/utils/formatting/formatCurrency'
import { Label } from '@/components/ui/label'
import { FormField } from '@/components/ui/form'

const categorySchema = z.object({
  id: z.string(),
  icon: z.string(),
  name: z.string(),
})

const userCategorySchema = categorySchema.extend({
  amount: z.number().positive('Amount must be greater than 0'),
})

type Category = Omit<z.infer<typeof categorySchema>, 'amount'>
type UserCategory = z.infer<typeof userCategorySchema>

const onboardingFormSchema = z.object({
  name: z
    .string()
    .min(1, 'You must provide a budget name')
    .max(50, "Budget name can't exceed 50 characters"),
  startAmount: z.number().positive('You must provide a budget amount'),
  categories: z.array(userCategorySchema),
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
      <h3 className="text-lg">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  )
}

function OnboardingPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)

  const categories: Array<Category> = [
    {
      icon: '🦚',
      id: 'thing',
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

  const toggleCategory = (category: Category) => {
    const currentCategories = form.state.values.categories
    const isSelected = currentCategories.some((cat) => cat.id === category.id)

    if (isSelected) {
      form.setFieldValue(
        'categories',
        currentCategories.filter((cat) => cat.id !== category.id),
      )
    } else {
      form.setFieldValue('categories', [
        ...currentCategories,
        { ...category, amount: 0 },
      ])
    }
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
                <Card>
                  <CardContent className="flex flex-col gap-6">
                    <form.AppField
                      name="name"
                      children={(field) => (
                        <field.TextField
                          label="Budget name"
                          placeholder="Enter budget name"
                        />
                      )}
                    />
                    <form.AppField
                      name="startAmount"
                      children={(field) => (
                        <field.NumberField
                          label="Start Amount"
                          placeholder="Total budget amount"
                        />
                      )}
                    />
                  </CardContent>
                </Card>
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
              <form.AppField
                name="categories"
                children={(field) => (
                  <div className="grid gap-3">
                    {categories.map((category) => {
                      const isChecked = field.state.value.some(
                        (cat) => cat.id === category.id,
                      )
                      return (
                        <Card>
                          <CardContent>
                            <SelectableCategoryItem
                              key={category.id}
                              {...category}
                              checked={isChecked}
                              onCheckedChange={() => toggleCategory(category)}
                            />
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              />
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
              <form.Subscribe
                selector={(state) => state.values.categories}
                children={(categories) => {
                  const totalAllocated = categories.reduce(
                    (sum, category) => sum + (category.amount || 0),
                    0,
                  )
                  return (
                    <Card>
                      <CardContent className="space-y-4">
                        <div className="flex flex-col gap-2">
                          <div
                            className="flex w-full items-center justify-between"
                          >
                            <h3 className="text-muted-foreground text-lg">
                              Total Allocated
                            </h3>
                            <div className="flex gap-3">
                              <span className="text-lg font-semibold">
                                {formatCurrency(totalAllocated, 'za')}
                              </span>
                              <span className="text-muted-foreground text-lg">
                                of
                              </span>
                              <span className="text-lg font-semibold">
                                {formatCurrency(
                                  form.state.values.startAmount,
                                  'za',
                                )}
                              </span>
                            </div>
                          </div>
                          <Progress
                            value={
                              (totalAllocated / form.state.values.startAmount) *
                              100
                            }
                          />
                        </div>
                        <div>
                          {form.state.values.categories.map(
                            (category, index) => (
                              <AllocatableCategoryItem
                                key={category.id}
                                id={category.id}
                                icon={category.icon}
                                name={category.name}
                              >
                                <form.AppField
                                  name={`categories[${index}].amount`}
                                  children={(field) => (
                                    <div
                                      className="flex w-28 items-center gap-1"
                                    >
                                      <span className="text-md text-gray-400">
                                        R
                                      </span>
                                      <field.NumberField placeholder="0" />
                                    </div>
                                  )}
                                />
                              </AllocatableCategoryItem>
                            ),
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                }}
              />
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
              'Finish'
            )}
          </Button>
        )}
      </div>
    </OnboardingLayout>
  )
}
