import z from 'zod'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { FieldGroup } from '../ui/field'
import type { FilterItems } from '../filter/Filter.types'
import { useAppForm } from '@/hooks/form'

const addExpenseSchema = z.object({
  description: z.string(),
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
      const cat = categories.find((c) => c.value === value.category)?.label
      const description =
        !value.description || value.description === ''
          ? cat!
          : value.description
      onSubmit({
        ...value,
        description,
      })
      form.reset()
      form.setFieldValue('category', '')
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
                <field.SearchableSelectField
                  filterItems={categories}
                  placeHolder="Select Category"
                />
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <form.AppForm>
          <form.FormButton
            enabledText="Create Expense"
            loadingText="Submitting"
            disabledText="Enter your new expense details"
            formId="add-expense-form"
          />
        </form.AppForm>
      </CardFooter>
    </Card>
  )
}
