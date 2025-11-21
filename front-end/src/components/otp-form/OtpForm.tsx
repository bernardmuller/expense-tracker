import { useAppForm } from '@/hooks/form'
import z from 'zod'
import { Card, CardContent, CardFooter } from '../ui/card'
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
    <Card>
      <span className="flex w-full justify-center text-lg font-semibold">
        {title}
      </span>
      <CardContent>
        <form
          id="otp-form"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="flex flex-col items-center space-y-3"
        >
          <div className="flex items-center">
            <form.AppField
              name="otp"
              children={(field) => <field.OtpField label="One-Time Password" />}
            />
          </div>
          <span className="text-center text-sm">
            Please enter the one-time password sent to your email address.
          </span>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button asChild>
          <LinkProvider>
            <span className="text-primary text-sm">Back</span>
          </LinkProvider>
        </Button>
      </CardFooter>
    </Card>
  )
}
