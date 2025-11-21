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
  const [userData, setUserData] = useState<{
    name: string
    email: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const registerMutation = useRegisterRequest()
  const verifyMutation = useRegisterVerify()

  const handleRegisterSubmit = async (value: {
    name: string
    email: string
  }) => {
    setError(null)

    registerMutation.mutate(value, {
      onSuccess: (result) => {
        if (result.isOk()) {
          // Save user data and advance to OTP step
          setUserData(value)
          setStep('verify')
        } else {
          // Handle error from Result
          const errorData = result.error
          if (errorData.status === 409) {
            setError('An account with this email already exists')
          } else {
            setError(errorData.body?.message || 'Registration failed')
          }
        }
      },
      onError: () => {
        setError('Network error. Please try again.')
      },
    })
  }

  const handleOtpSubmit = async (value: { otp: string }) => {
    setError(null)

    verifyMutation.mutate(value, {
      onSuccess: (result) => {
        if (result.isOk()) {
          // Navigate to login on successful verification
          navigate({ to: '/login' })
        } else {
          // Handle error from Result
          const errorData = result.error
          if (errorData.status === 401) {
            setError('Invalid or expired OTP. Please try again.')
          } else if (errorData.status === 404) {
            setError(
              'Verification token expired. Please start registration again.',
            )
            setStep('register')
          } else {
            setError(errorData.body?.message || 'Verification failed')
          }
        }
      },
      onError: () => {
        setError('Network error. Please try again.')
      },
    })
  }

  const handleBackToRegister = () => {
    setStep('register')
    setError(null)
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gray-50 p-4"
    >
      <div className="w-full max-w-md">
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

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
              <span onClick={handleBackToRegister} className="cursor-pointer">
                {children}
              </span>
            )}
          />
        )}
      </div>
    </div>
  )
}
