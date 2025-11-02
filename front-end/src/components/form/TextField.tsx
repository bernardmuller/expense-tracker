import { useFieldContext } from '@/hooks/form-context'
import { useStore } from '@tanstack/react-form'
import { Input } from '@/components/ui/input'
import { Field, FieldError, FieldLabel } from '../ui/field'

export default function TextField({ label, placeholder }: { label?: string, placeholder: string }) {
  const field = useFieldContext<string>()
  const isInvalid = useStore(field.store, (state) => !state.meta.isValid)

  return (
    <Field data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
      <Input
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        placeholder={placeholder}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        autoComplete="off"
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
