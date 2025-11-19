import { useAppForm } from '@/hooks/form'
import z from 'zod'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { useEffect, useRef } from 'react'

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, 'Please enter all 6 digits')
    .regex(/^\d+$/, 'OTP must contain only numbers'),
})

type OtpFormValues = z.infer<typeof otpSchema>

export default function OtpForm({
  title,
  onSubmit,
  linkProvider: LinkProvider,
}: {
  title: string
  onSubmit: (value: OtpFormValues) => void
  linkProvider: React.ComponentType<{ children: React.ReactNode }>
}) {
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

  const autoSubmittedRef = useRef(false)

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
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="otp-form"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="flex flex-col items-center gap-3"
        >
          <form.AppField name="otp" children={(field) => <field.OtpField label='One-Time Password'/>} />
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
