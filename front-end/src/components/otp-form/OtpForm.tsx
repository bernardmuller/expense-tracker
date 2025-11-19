import { useAppForm } from '@/hooks/form'
import { useEffect, useRef } from 'react'
import z from 'zod'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { useFieldContext } from '@/hooks/form-context'
import { Field, FieldError, FieldLabel } from '../ui/field'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp'
import { useStore } from '@tanstack/react-form'

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, 'Please enter all 6 digits')
    .regex(/^\d+$/, 'OTP must contain only numbers'),
})

type OtpFormValues = z.infer<typeof otpSchema>

function OtpFieldComponent() {
  const field = useFieldContext<string>()
  const isInvalid = useStore(field.store, (state) => !state.meta.isValid)

  return (
    <Field data-invalid={isInvalid} className="items-center">
      <FieldLabel htmlFor={field.name}>One-Time Password</FieldLabel>
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
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}

export default function OtpForm({
  onSubmit,
  linkProvider: LinkProvider,
}: {
  onSubmit: (value: OtpFormValues) => void
  linkProvider: React.ComponentType<{ children: React.ReactNode }>
}) {
  const autoSubmittedRef = useRef(false)

  const form = useAppForm({
    defaultValues: {
      otp: '',
    },
    validators: {
      onSubmit: otpSchema,
    },
    onSubmit: ({ value }) => {
      onSubmit(value)
    },
  })

  useEffect(() => {
    const subscription = form.store.subscribe(() => {
      const state = form.store.state
      const otpValue = state.values.otp

      if (
        otpValue &&
        otpValue.length === 6 &&
        !autoSubmittedRef.current &&
        !state.isSubmitting
      ) {
        autoSubmittedRef.current = true
        setTimeout(() => {
          form.handleSubmit()
        }, 0)
      } else if (otpValue && otpValue.length < 6) {
        autoSubmittedRef.current = false
      }
    })

    return () => subscription()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="otp-form"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="grid gap-3"
        >
          <form.AppField name="otp" children={() => <OtpFieldComponent />} />
          <span className="text-sm">
            Please enter the one-time password sent to your email address.
          </span>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <form.AppForm>
          <form.FormButton
            enabledText="Submit"
            loadingText="Verifying"
            disabledText="Enter the 6-digit code"
            formId="otp-form"
          />
        </form.AppForm>
        <div className="text-muted-foreground text-center text-sm">
          <LinkProvider>
            <span className="text-primary">Back</span>
          </LinkProvider>
        </div>
      </CardFooter>
    </Card>
  )
}
