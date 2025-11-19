import { useFieldContext } from '@/hooks/form-context'
import { useStore } from '@tanstack/react-form'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'

export default function OtpField({ label }: { label?: string }) {
  const field = useFieldContext<string>()
  const isInvalid = useStore(field.store, (state) => !state.meta.isValid)

  return (
    <Field data-invalid={isInvalid} className='bg-black-900'>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
      <InputOTP
        id={field.name}
        maxLength={6}
        value={field.state.value}
        onChange={(value) => field.handleChange(value)}
        onBlur={field.handleBlur}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
