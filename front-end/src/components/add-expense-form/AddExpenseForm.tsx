import { useAppForm } from '@/hooks/form'
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

const addExpenseSchema = z.object({
  description: z
    .string()
    .min(1, 'You must provide a description')
    .max(30, "Description can't exceed 30 characters"),
  amount: z.number().positive('You must provide the amount'),
  category: z.string().refine((val) => val !== '', {
    message: 'You must specify a category',
  }),
})

type AddExpenseFormValues = z.infer<typeof addExpenseSchema>

export default function AddExpenseForm({
  onSubmit,
  categories,
}: {
  onSubmit: (value: AddExpenseFormValues) => void
  categories: FilterItems
}) {
  const form = useAppForm({
    defaultValues: {
      description: '',
      amount: 0,
      category: '',
    },
    validators: {
      onSubmit: addExpenseSchema,
    },
    onSubmit: ({ value }) => {
      onSubmit(value)
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="add-expense-form"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.AppField
              name="description"
              children={(field) => (
                <field.TextField placeholder="Expense name" />
              )}
            />
            <form.AppField
              name="amount"
              children={(field) => <field.NumberField placeholder="Amount" />}
            />
            <form.AppField
              name="category"
              children={(field) => (
                <field.SelectField
                  filterItems={categories}
                  placeHolder="Categories"
                />
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <form.AppForm>
          <form.FormButton
            enabledText="Submit"
            loadingText="Submitting"
            disabledText="Enter your new expense details"
            formId="add-expense-form"
          />
        </form.AppForm>
      </CardFooter>
    </Card>
  )
}
