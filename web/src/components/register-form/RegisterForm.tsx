import { useAppForm } from '@/hooks/form'
import z from 'zod'
import { FieldGroup } from '../ui/field'

const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, "Name can't exceed 50 characters"),
  email: z.email('Please provide a valid email address'),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterForm({
  onSubmit,
  linkProvider: LinkProvider,
}: {
  onSubmit: (value: RegisterFormValues) => void
  linkProvider: React.ComponentType<{ children: React.ReactNode }>
}) {
  const form = useAppForm({
    defaultValues: {
      name: '',
      email: '',
    },
    validators: {
      onSubmit: registerSchema,
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
            Create your account
          </h1>
          <div className="text-muted-foreground text-sm">
            Already have an account?{' '}
            <LinkProvider>
              <span className="text-primary hover:underline">Sign in →</span>
            </LinkProvider>
          </div>
        </div>
      </div>

      <form
        id="register-form"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="w-full space-y-6"
      >
        <FieldGroup>
          <form.AppField
            name="name"
            children={(field) => <field.TextField placeholder="Name" />}
          />
          <form.AppField
            name="email"
            children={(field) => (
              <field.TextField placeholder="Email address" />
            )}
          />
        </FieldGroup>

        <form.AppForm>
          <form.FormButton
            enabledText="Create Account"
            loadingText="Creating Account"
            disabledText="Enter your details to register"
            formId="register-form"
          />
        </form.AppForm>
      </form>
    </div>
  )
}
