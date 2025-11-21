import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import RegisterForm from '@/components/register-form/RegisterForm'
import OtpForm from '@/components/otp-form/OtpForm'
import { useRegisterRequest } from '@/lib/http/hooks/use-register-request'
import { useRegisterVerify } from '@/lib/http/hooks/use-register-verify'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

type Step = 'register' | 'verify'

function RegisterPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('register')

  const registerMutation = useRegisterRequest()
  const verifyMutation = useRegisterVerify()

  const handleRegisterSubmit = async (value: { name: string; email: string }) =>
    registerMutation.mutate(value, {
      onSuccess: (result) => result.isOk() && setStep('verify'),
    })

  const handleOtpSubmit = async (value: { otp: string }) =>
    verifyMutation.mutate(value, {
      // @ts-ignore: will be fixed once the login route exists
      onSuccess: (result) => result.isOk() && navigate({ to: '/login' }),
    })

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gray-50 p-4"
    >
      <div className="w-full max-w-md">
        {step === 'register' ? (
          <RegisterForm
            onSubmit={handleRegisterSubmit}
            linkProvider={({ children }) => (
              // @ts-ignore: will be fixed once the login route exists
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
