import { useFieldContext } from '@/hooks/form-context'
import { Field, FieldError, FieldLabel } from '../ui/field'
import { useStore } from '@tanstack/react-form'
import type { FilterItems } from '../filter/Filter.types'
import { SearchableSelect } from '../ui/searchable-select'

export default function SearchableSelectField({
  label,
  placeHolder,
  filterItems,
}: {
  label?: string
  placeHolder: string
  filterItems: FilterItems
}) {
  const field = useFieldContext<string>()
  const isInvalid = useStore(field.store, (state) => !state.meta.isValid)

  return (
    <Field data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
      <SearchableSelect
        options={filterItems}
        onChange={field.handleChange}
        value={field.state.value}
        placeholder={placeHolder}
        name={field.name}
        aria-invalid={isInvalid}
        isClearable={true}
        isSearchable={true}
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
