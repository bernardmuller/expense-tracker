import { useState } from 'react'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface AuthFormProps {
  onSuccess?: () => void
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
  const [isSignUp, setIsSignUp] = useState(false)

  // Check for signup feature flag - defaulting to true for now
  // In production, this should be controlled via server-side config
  const isSignupEnabled = true

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="text-6xl mb-4">💰</div>
        <h1 className="text-2xl font-bold mb-2">
          Expense Tracker
        </h1>
        <p className="text-muted-foreground">
          {isSignUp ? 'Create your account' : 'Sign in to your account'}
        </p>
      </CardHeader>
      <CardContent>
        {isSignUp ? (
          <SignupForm
            onSuccess={onSuccess}
            onSwitchToLogin={() => setIsSignUp(false)}
          />
        ) : (
          <LoginForm
            onSuccess={onSuccess}
            onSwitchToSignup={isSignupEnabled ? () => setIsSignUp(true) : undefined}
            showSignupLink={isSignupEnabled}
          />
        )}
      </CardContent>
    </Card>
  )
}
