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
    setIsLoading(true)
    setError(null)

    try {
      await authClient.signIn.email({
        email,
        password,
      })

      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
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
        <div className="bg-destructive/5 border border-destructive/50 rounded-md p-3">
          <p className="text-destructive text-sm">{error}</p>
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