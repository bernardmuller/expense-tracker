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
    onSubmit: ({ value }) => {
      onSubmit(value)
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="login-form"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
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
            enabledText="Log in"
            loadingText="Logging in"
            disabledText="Enter your email to log in"
            formId="login-form"
          />
        </form.AppForm>
        <div className="text-muted-foreground text-center text-sm">
          Don't have an account?{' '}
          <LinkProvider>
            <span className="text-primary">Register</span>
          </LinkProvider>
        </div>
      </CardFooter>
    </Card>
  )
}
