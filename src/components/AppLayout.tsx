import { ReactNode } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useSession } from '@/lib/hooks'
import { ArrowLeft, Settings } from 'lucide-react'

interface AppLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
  showBackButton?: boolean
  actions?: ReactNode
}

export default function AppLayout({
  children,
  title,
  subtitle,
  showBackButton = false,
}: AppLayoutProps) {
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* Fixed Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {showBackButton && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.history.back()}
                >
                  <ArrowLeft />
                </Button>
              )}
              {title && (
                <div>
                  <h1 className="text-lg font-semibold text-foreground">{title}</h1>
                  {subtitle && (
                    <p className="text-sm text-muted-foreground">{subtitle}</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {session?.data?.user && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                  >
                    <Link to="/settings">
                      <Settings />
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-md px-4 py-4 mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
