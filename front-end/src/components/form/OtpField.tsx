import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot
} from '@/components/ui/input-otp'
import { useFieldContext } from '@/hooks/form-context'
import { useStore } from '@tanstack/react-form'

export default function OtpField({ label }: { label?: string }) {
  const field = useFieldContext<string>()
  const isInvalid = useStore(field.store, (state) => !state.meta.isValid)

  return (
    <Field data-invalid={isInvalid}>
      {label && (
        <FieldLabel className="flex justify-center" htmlFor={field.name}>
          {label}
        </FieldLabel>
      )}
      <InputOTP
        id={field.name}
        maxLength={6}
        value={field.state.value}
        onChange={(value) => field.handleChange(value)}
        onBlur={field.handleBlur}
        className="flex items-center"
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
