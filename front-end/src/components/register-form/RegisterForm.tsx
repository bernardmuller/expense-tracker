import { useAppForm } from '@/hooks/form'
import z from 'zod'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'
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
    onSubmit: ({ value }) => {
      onSubmit(value)
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="register-form"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
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
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <form.AppForm>
          <form.FormButton
            enabledText="Create Account"
            loadingText="Creating Account"
            disabledText="Enter your details to register"
            formId="register-form"
          />
        </form.AppForm>
        <div className="text-muted-foreground text-center text-sm">
          Already have an account?{' '}
          <LinkProvider>
            <span className="text-primary">Log in</span>
          </LinkProvider>
        </div>
      </CardFooter>
    </Card>
  )
}
