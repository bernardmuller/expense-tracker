import { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface LoginFormProps {
  onSuccess?: () => void
  onSwitchToSignup?: () => void
  showSignupLink?: boolean
}

export default function LoginForm({ onSuccess, onSwitchToSignup, showSignupLink }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login form submitted')
    setIsLoading(true)
    setError(null)

    console.log('Attempting to sign in with email:', email)

    try {
      console.log('Calling authClient.signIn.email...')
      const result = await authClient.signIn.email({
        email,
        password,
      })
      console.log('Sign in successful:', result)

      onSuccess?.()
    } catch (err) {
      console.error('Sign in error:', err)
      console.error('Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        error: err
      })

      let errorMessage = 'Login failed'

      if (err instanceof Error) {
        errorMessage = err.message

        // Handle specific error types
        if (err.message.includes('fetch')) {
          errorMessage = 'Unable to connect to server. Please check your internet connection.'
        } else if (err.message.includes('Invalid') || err.message.includes('credentials')) {
          errorMessage = 'Invalid email or password. Please try again.'
        } else if (err.message.includes('Network')) {
          errorMessage = 'Network error. Please try again.'
        }
      }

      setError(errorMessage)
    } finally {
      setIsLoading(false)
      console.log('Login attempt completed')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">
          Email
        </Label>
        <Input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">
          Password
        </Label>
        <Input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
          minLength={6}
        />
      </div>

      {error && (
        <div className="bg-destructive/10 border-2 border-destructive/50 rounded-md p-4">
          <div className="flex items-start gap-2">
            <div className="text-destructive text-lg">⚠️</div>
            <div>
              <p className="text-destructive font-medium text-sm mb-1">Login Failed</p>
              <p className="text-destructive text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2"></div>
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </Button>

      {showSignupLink && onSwitchToSignup && (
        <div className="text-center">
          <Button
            type="button"
            variant="link"
            onClick={onSwitchToSignup}
            disabled={isLoading}
            className="text-sm"
          >
            Don't have an account? Sign up
          </Button>
        </div>
      )}
    </form>
  )
}
