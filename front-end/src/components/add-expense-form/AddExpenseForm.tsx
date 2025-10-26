import { generateFilterProps } from '../filter/__mocks__/filterProps.mock'
import Filter from '../filter/Filter'
import { SpinnerButton } from '../spinner-button/SpinnerButton'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { Field, FieldError, FieldGroup } from '../ui/field'
import { Input } from '../ui/input'
import { useMyFormContext } from './AddExpenseForm.compound'

const { filterItems } = generateFilterProps()

export default function AddExpenseForm() {
  const form = useMyFormContext()

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
                    {/*<FieldLabel htmlFor={field.name}>Description</FieldLabel>*/}
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Expense name"
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
                    {/*<FieldLabel htmlFor={field.name}>Amount</FieldLabel>*/}
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value === 0 ? '' : field.state.value}
                      onBlur={field.handleBlur}
                      type="number"
                      placeholder="Amount"
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
                    {/*<FieldLabel htmlFor={field.name}>Category</FieldLabel>*/}
                    <Filter
                      filterItems={filterItems}
                      handleValueChange={field.handleChange}
                      placeHolder="Categories"
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
