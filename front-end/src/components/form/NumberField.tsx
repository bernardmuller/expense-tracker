import { useFieldContext } from '@/hooks/form-context'
import { useStore } from '@tanstack/react-form'
import { Input } from '@/components/ui/input'
import { Field, FieldError, FieldLabel } from '../ui/field'

export default function NumberField({
  label,
  placeholder,
  min,
}: {
  label?: string
  placeholder: string
  min?: number
}) {
  const field = useFieldContext<number>()
  const isInvalid = useStore(field.store, (state) => !state.meta.isValid)
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <Field data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
      <Input
        id={field.name}
        name={field.name}
        value={field.state.value}
        min={min}
        onFocus={(e) => {
          if (field.state.value === 0) {
            e.target.select()
          }
        }}
        onBlur={() => {
          if (isNaN(field.state.value)) {
            field.handleChange(min ?? 0)
          } else if (min !== undefined && field.state.value < min) {
            field.handleChange(min)
          }
          field.handleBlur()
        }}
        type="number"
        placeholder={placeholder}
        onChange={(e) => field.handleChange(e.target.valueAsNumber)}
        aria-invalid={isInvalid}
        autoComplete="off"
      />
      {isInvalid && <FieldError errors={errors} />}
    </Field>
  )
}
