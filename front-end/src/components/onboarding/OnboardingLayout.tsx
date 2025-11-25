type OnboardingLayoutProps = {
  children: React.ReactNode
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return (
    <div className="flex h-screen items-stretch justify-center p-4">
      <div className="flex h-full w-full max-w-2xl flex-col pt-10">{children}</div>
    </div>
  )
}
