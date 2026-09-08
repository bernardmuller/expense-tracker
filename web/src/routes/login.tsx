import {
	createFileRoute,
	Link,
	useNavigate,
	redirect,
} from '@tanstack/react-router'
import { useState } from 'react'
import LoginForm from '@/components/login-form/LoginForm'
import OtpForm from '@/components/otp-form/OtpForm'
import { useLoginRequest } from '@/lib/http/hooks/use-login-request'
import { useLoginVerify } from '@/lib/http/hooks/use-login-verify'
import { useAuth } from '@/lib/auth/auth-provider'
import { hasTokens } from '@/lib/auth/token-storage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/login')({
	beforeLoad: () => {
		if (hasTokens()) {
			throw redirect({ to: '/' })
		}
	},
	component: LoginPage,
})

type Step = 'login' | 'verify'

function LoginPage() {
	const navigate = useNavigate()
	const auth = useAuth()
	const [step, setStep] = useState<Step>('login')
	const [devOtp, setDevOtp] = useState<string | null>(null)

	const loginMutation = useLoginRequest()
	const verifyMutation = useLoginVerify()

	const handleLoginSubmit = async (value: { email: string }) => {
		const result = await loginMutation.mutateAsync(value)
		if (result.isOk()) {
			if (process.env.NODE_ENV === "development") {
				setDevOtp(result._unsafeUnwrap().otp)
			}
			setStep('verify')
		}
	}

	const handleOtpSubmit = async (value: { otp: string }) => {
		const result = await verifyMutation.mutateAsync(value)
		if (result.isOk()) {
			auth.login()
			navigate({ to: '/' })
		}
	}

	return (
		<div
			className="bg-background flex min-h-screen items-center justify-center
        p-4"
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
					<>
						{process.env.NODE_ENV === "development" && (
							<Card>
								<CardHeader>
									<CardTitle>
										<h2 className="text-lg">Development mode</h2>
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p>OTP: {devOtp}</p>
								</CardContent>
							</Card>
						)}
						<OtpForm
							title="Verify Your Login"
							onSubmit={handleOtpSubmit}
							linkProvider={({ children }) => (
								<span onClick={() => setStep('login')} className="cursor-pointer">
									{children}
								</span>
							)}
						/>

					</>
				)}
			</div>
		</div>
	)
}
