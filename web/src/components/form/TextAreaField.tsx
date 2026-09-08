import { useFieldContext } from '@/hooks/form-context'
import { useStore } from '@tanstack/react-form'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldError, FieldLabel } from '../ui/field'

export default function TextAreaField({
  label,
  placeholder,
}: {
  label?: string
  placeholder?: string
}) {
  const field = useFieldContext<string>()
  const isInvalid = useStore(field.store, (state) => !state.meta.isValid)

  return (
    <Field data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
      <Textarea
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        placeholder={placeholder}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
