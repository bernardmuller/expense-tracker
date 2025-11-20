import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import RegisterForm from '@/components/register-form/RegisterForm'
import OtpForm from '@/components/otp-form/OtpForm'
import { client } from '@/lib/auth-client'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

const VERIFICATION_TOKEN_KEY = 'verification_token'

type Step = 'register' | 'verify'

function RegisterPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const handleRegisterSubmit = async (value: {
    name: string
    email: string
  }) => {
    try {
      const response = await client.auth.register.request.$post({
        json: value,
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (response.status === 409) {
          setError('An account with this email already exists')
        } else {
          setError((errorData as any).message || 'Registration failed')
        }
        return
      }

      const data = await response.json()

      // Store verification token in sessionStorage
      sessionStorage.setItem(VERIFICATION_TOKEN_KEY, data.token)

      // Save user data and advance to OTP step
      setUserData(value)
      setStep('verify')
    } catch (err) {
      setError('Network error. Please try again.')
      console.error('Registration error:', err)
    }
  }

  const handleOtpSubmit = async (value: { otp: string }) => {
    console.log(value)
  }

  const handleBackToRegister = () => {
    console.log()
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
        {step !== 'register' ? (
          <OtpForm
            title="Verify Your Email"
            onSubmit={handleOtpSubmit}
            linkProvider={({ children }) => (
              <span onClick={handleBackToRegister} className="cursor-pointer">
                {children}
              </span>
            )}
          />
        ) : (
          <RegisterForm
            onSubmit={handleRegisterSubmit}
            linkProvider={({ children }) => (
              <Link to="/login" className="cursor-pointer">
                {children}
              </Link>
            )}
          />
        )}
      </div>
    </div>
  )
}
