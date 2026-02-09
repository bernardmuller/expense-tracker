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

  const handleRegisterSubmit = async (value: { name: string; email: string }) => {
    const result = await registerMutation.mutateAsync(value)
    if (result.isOk()) {
      setStep('verify')
    }
  }

  const handleOtpSubmit = async (value: { otp: string }) => {
    const result = await verifyMutation.mutateAsync(value)
    if (result.isOk()) {
      await navigate({ to: '/login' })
      toast.success('Registered successfully, please log in.')
    }
  }

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
