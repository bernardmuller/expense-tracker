import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowRight, LogOut } from 'lucide-react'
import AuthForm from '../components/AuthForm'
import AppLayout from '../components/AppLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useSession } from '@/lib/hooks'
import { authClient } from '@/lib/auth-client'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const { data: session, isLoading: sessionLoading } = useSession()
  const queryClient = useQueryClient()
  const [isExiting, setIsExiting] = useState<boolean>(false)

  const handleAuthSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['session'] })
  }

  const handleSignOut = async () => {
    await authClient.signOut()
    queryClient.invalidateQueries({ queryKey: ['session'] })
  }

  const handleConfirmExit = () => {
    setIsExiting(true)
  }

  useEffect(() => {
    const handleClickOutside = () => {
      setIsExiting(false)
    }

    if (isExiting) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isExiting])

  if (sessionLoading) {
    return (
      <AppLayout>
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </AppLayout>
    )
  }

  if (!session?.data?.user) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <AuthForm onSuccess={handleAuthSuccess} />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout
      title="Settings"
      showBackButton
    >
      <div className="space-y-2">
        <div className='flex items-center justify-between'>
          <h3 className="text-lg text-muted-foreground py-0">My Account</h3>
          {isExiting ? (
            <Tooltip open={isExiting}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSignOut}
                  className="text-red-600 hover:text-red-700 bg-red-200 hover:bg-red-100 transition-all duration-200 ease-in-out"
                  aria-label="Confirm Exit"
                >
                  <LogOut />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="left"
                className='p-2.5'
              >
                You sure?
              </TooltipContent>
            </Tooltip>

          ) : (
            <Button
              variant="outline"
              onClick={handleConfirmExit}
              size="icon"
            >
              <LogOut />
            </Button>
          )}
        </div>
        <Card>
          <CardContent>
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-foreground">{session.data.user.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-foreground">{session.data.user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <h3 className="text-lg text-muted-foreground pb-1 pt-3">Preferences</h3>
        <Card className='py-4'>
          <CardContent className="flex items-center justify-between">
            <h3 className="font-lg">Expense Categories</h3>
            <Button
              size="icon"
              variant="ghost"
            >
              <Link to="/categories">
                <ArrowRight />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout >
  )
}
