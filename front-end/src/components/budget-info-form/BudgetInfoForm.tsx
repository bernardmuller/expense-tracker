import { useAppForm } from '@/hooks/form'
import { Button } from '@/components/ui/button'
import z from 'zod'
import type { FilterItems } from '../filter/Filter.types'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { FieldGroup } from '../ui/field'

const budgetInfoSchema = z.object({
  budgetName: z
    .string()
    .min(1, 'You must provide a budget name')
    .max(50, "Budget name can't exceed 50 characters"),
  budgetAmount: z.number().positive('You must provide a budget amount'),
  categoryAllocations: z
    .array(
      z.object({
        category: z.string().refine((val) => val !== '', {
          message: 'You must specify a category',
        }),
        amount: z.number().positive('You must provide an amount'),
      })
    )
    .min(1, 'You must add at least one category allocation'),
})

export type BudgetInfoFormValues = z.infer<typeof budgetInfoSchema>

export default function BudgetInfoForm({
  onSubmit,
  categories,
}: {
  onSubmit: (value: BudgetInfoFormValues) => void
  categories: FilterItems
}) {
  const form = useAppForm({
    defaultValues: {
      budgetName: '',
      budgetAmount: 0,
      categoryAllocations: [] as Array<{ category: string; amount: number }>,
    },
    validators: {
      onSubmit: budgetInfoSchema,
    },
    onSubmit: ({ value }) => {
      onSubmit(value)
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Your Budget</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="budget-info-form"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.AppField
              name="budgetName"
              children={(field) => (
                <field.TextField placeholder="Budget name (e.g., Monthly Budget)" />
              )}
            />
            <form.AppField
              name="budgetAmount"
              children={(field) => (
                <field.NumberField placeholder="Total budget amount" />
              )}
            />

            {/* Dynamic category allocations section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Category Allocations
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const currentAllocations =
                      form.state.values.categoryAllocations
                    form.setFieldValue('categoryAllocations', [
                      ...currentAllocations,
                      { category: '', amount: 0 },
                    ])
                  }}
                >
                  Add Category
                </Button>
              </div>

              <form.AppField
                name="categoryAllocations"
                children={(field) => (
                  <div className="space-y-3">
                    {field.state.value.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No categories added yet. Click "Add Category" to start.
                      </p>
                    )}
                    {field.state.value.map((_, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 p-3 border rounded-md"
                      >
                        <div className="flex-1 space-y-2">
                          <form.AppField
                            name={`categoryAllocations[${index}].category`}
                            children={(catField) => (
                              <catField.SelectField
                                filterItems={categories}
                                placeHolder="Select category"
                              />
                            )}
                          />
                          <form.AppField
                            name={`categoryAllocations[${index}].amount`}
                            children={(amtField) => (
                              <amtField.NumberField placeholder="Amount" />
                            )}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const currentAllocations =
                              form.state.values.categoryAllocations
                            form.setFieldValue(
                              'categoryAllocations',
                              currentAllocations.filter((_, i) => i !== index)
                            )
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-destructive">
                        {field.state.meta.errors.join(', ')}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <form.AppForm>
          <form.FormButton
            enabledText="Create Budget"
            loadingText="Creating..."
            disabledText="Fill in budget details"
            formId="budget-info-form"
          />
        </form.AppForm>
      </CardFooter>
    </Card>
  )
}
