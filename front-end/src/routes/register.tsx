import {
  createFileRoute,
  Link,
  useNavigate,
  redirect,
} from '@tanstack/react-router'
import { useState } from 'react'
import RegisterForm from '@/components/register-form/RegisterForm'
import OtpForm from '@/components/otp-form/OtpForm'
import { useRegisterRequest } from '@/lib/http/hooks/use-register-request'
import { useRegisterVerify } from '@/lib/http/hooks/use-register-verify'
import { hasTokens } from '@/lib/auth/token-storage'
import { toast } from 'sonner'

export const Route = createFileRoute('/register')({
  beforeLoad: () => {
    if (hasTokens()) {
      throw redirect({ to: '/' })
    }
  },
  component: RegisterPage,
})

type Step = 'register' | 'verify'

function RegisterPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('register')

  const registerMutation = useRegisterRequest()
  const verifyMutation = useRegisterVerify()

  const handleRegisterSubmit = (value: { name: string; email: string }) =>
    registerMutation.mutate(value, {
      onSuccess: (result) => result.isOk() && setStep('verify'),
    })

  const handleOtpSubmit = (value: { otp: string }) =>
    verifyMutation.mutate(value, {
      onSuccess: (result) =>
        result.isOk() &&
        navigate({ to: '/login' }).then(() =>
          toast.success('Registered successfully, please log in.'),
        ),
    })

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        {step === 'register' ? (
          <RegisterForm
            onSubmit={handleRegisterSubmit}
            linkProvider={({ children }) => (
              <Link to="/login" className="cursor-pointer">
                {children}
              </Link>
            )}
          />
        ) : (
          <OtpForm
            title="Verify Your Email"
            onSubmit={handleOtpSubmit}
            linkProvider={({ children }) => (
              <span
                onClick={() => setStep('register')}
                className="cursor-pointer"
              >
                {children}
              </span>
            )}
          />
        )}
      </div>
    </div>
  )
}
