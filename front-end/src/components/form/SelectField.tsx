import { useFieldContext } from '@/hooks/form-context'
import { Field, FieldError, FieldLabel } from '../ui/field'
import Filter from '../filter/Filter'
import { useStore } from '@tanstack/react-form'
import type { FilterItems } from '../filter/Filter.types'

export default function SelectField({
  label,
  placeHolder,
  filterItems,
}: {
  label?: string
  placeHolder: string
  filterItems: FilterItems
}) {
  const field = useFieldContext()
  const isInvalid = useStore(field.store, (state) => !state.meta.isValid)

  return (
    <Field data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
      <Filter
        filterItems={filterItems}
        handleValueChange={field.handleChange}
        placeHolder={placeHolder}
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
