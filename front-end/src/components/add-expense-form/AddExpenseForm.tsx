import { useForm } from '@tanstack/react-form'
import * as z from 'zod'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { SpinnerButton } from '../spinner-button/SpinnerButton'
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'

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
      onBlur: addExpenseFormSchema,
      onMount: addExpenseFormSchema,
    },
    onSubmit: async ({ value }) => props.onSubmit(value),
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
            <form.Field
              name="description"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Describe your expense"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
            <form.Field
              name="amount"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Amount</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      type="number"
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
                      }
                      aria-invalid={isInvalid}
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
            <form.Field
              name="category"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="e.g., Food, Transport"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <SpinnerButton
              enabledText="Submit"
              className="w-full"
              isDisabled={!canSubmit}
              isLoading={isSubmitting}
              disabledText={
                isSubmitting ? 'Submitting' : 'Enter your expense details'
              }
              buttonProps={{ type: 'submit', form: 'add-expense-form' }}
            />
          )}
        />
      </CardFooter>
    </Card>
  )
}
