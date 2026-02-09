import { useAppForm } from '@/hooks/form'
import z from 'zod'
import { FieldGroup } from '../ui/field'

const loginSchema = z.object({
  email: z.email('Please provide a valid email address'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginForm({
  onSubmit,
  linkProvider: LinkProvider,
}: {
  onSubmit: (value: LoginFormValues) => void
  linkProvider: React.ComponentType<{ children: React.ReactNode }>
}) {
  const form = useAppForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <img src="/favicon.ico" alt="Logo" className="h-16 w-16" />
        <div className="flex flex-col items-center space-y-1">
          <h1 className="text-foreground text-2xl font-semibold">
            Sign in to your account
          </h1>
          <div className="text-muted-foreground text-sm">
            Don't have an account?{' '}
            <LinkProvider>
              <span className="text-primary hover:underline">
                Create one now →
              </span>
            </LinkProvider>
          </div>
        </div>
      </div>

      <form
        id="login-form"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="w-full space-y-6"
      >
        <FieldGroup>
          <form.AppField
            name="email"
            children={(field) => (
              <field.TextField placeholder="john.doe@example.com" />
            )}
          />
        </FieldGroup>

        <form.AppForm>
          <form.FormButton
            enabledText="Sign in"
            loadingText="Signing in"
            disabledText="Enter your email to log in"
            formId="login-form"
          />
        </form.AppForm>
      </form>
    </div>
  )
}
