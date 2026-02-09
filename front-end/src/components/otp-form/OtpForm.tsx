import { useAppForm } from '@/hooks/form'
import z from 'zod'
import { Button } from '../ui/button'

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
    listeners: {
      onChangeDebounceMs: 100,
      onChange: ({ fieldApi, formApi }) => {
        if (fieldApi.state.value.length === 6) {
          formApi.handleSubmit()
        }
      },
    },
  })

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <img src="/favicon.ico" alt="Logo" className="h-16 w-16" />
        <h1 className="text-foreground text-2xl font-semibold text-center">
          {title}
        </h1>
      </div>

      <form
        id="otp-form"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="flex w-full flex-col items-center space-y-4"
      >
        <div className="flex items-center">
          <form.AppField
            name="otp"
            children={(field) => <field.OtpField label="One-Time Password" />}
          />
        </div>
        <span className="text-muted-foreground text-center text-sm">
          Please enter the one-time password sent to your email address.
        </span>
      </form>

      <div className="flex w-full justify-center">
        <Button variant="ghost" asChild>
          <LinkProvider>
            <span className="text-primary text-sm">Back</span>
          </LinkProvider>
        </Button>
      </div>
    </div>
  )
}
