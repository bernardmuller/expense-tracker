import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import LoginForm from '@/components/login-form/LoginForm'
import OtpForm from '@/components/otp-form/OtpForm'
import { useLoginRequest } from '@/lib/http/hooks/use-login-request'
import { useLoginVerify } from '@/lib/http/hooks/use-login-verify'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

type Step = 'login' | 'verify'

function LoginPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('login')

  const loginMutation = useLoginRequest()
  const verifyMutation = useLoginVerify()

  const handleLoginSubmit = async (value: { email: string }) =>
    loginMutation.mutate(value, {
      onSuccess: (result) => result.isOk() && setStep('verify'),
    })

  const handleOtpSubmit = async (value: { otp: string }) =>
    verifyMutation.mutate(value, {
      onSuccess: (result) => result.isOk() && navigate({ to: '/' }),
    })

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gray-50 p-4"
    >
      <div className="w-full max-w-md">
        {step === 'login' ? (
          <LoginForm
            onSubmit={handleLoginSubmit}
            linkProvider={({ children }) => (
              <Link to="/register" className="cursor-pointer">
                {children}
              </Link>
            )}
          />
        ) : (
          <OtpForm
            title="Verify Your Login"
            onSubmit={handleOtpSubmit}
            linkProvider={({ children }) => (
              <span
                onClick={() => setStep('login')}
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
