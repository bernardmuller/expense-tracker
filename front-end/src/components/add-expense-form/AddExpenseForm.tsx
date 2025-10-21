import { useForm } from '@tanstack/react-form'
import * as z from 'zod'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'

type AddExpenseFormProps = {
  onSubmit: (value: AddExpenseFormSchema) => void
}

const addExpenseFormSchema = z.object({
  description: z
    .string()
    .min(1, 'You must provide a description')
    .max(30, "Description can't exceed 30 characters"),
  amount: z.number().min(1, 'You must provide the amount'),
  category: z.string().min(1, 'You must specify a category'),
})

type AddExpenseFormSchema = z.infer<typeof addExpenseFormSchema>

export default function AddExpenseForm(props: AddExpenseFormProps) {
  const form = useForm({
    defaultValues: {
      description: '',
      amount: 0,
      category: '',
    },
    validators: {
      onSubmit: addExpenseFormSchema,
    },
    onSubmit: async ({ value }) => props.onSubmit(value),
  })
  return (
    <Card>
      <form
        id="add-expense-form"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <CardHeader>
          <CardTitle>Add Expense</CardTitle>
        </CardHeader>
        <CardContent></CardContent>
        <CardFooter>

        </CardFooter>
      </form>
    </Card>
  )
}
