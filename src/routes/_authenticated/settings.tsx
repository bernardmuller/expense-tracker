import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowRight, LogOut } from 'lucide-react'
import AppLayout from '../../components/AppLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useSession } from '@/lib/hooks'
import { authClient } from '@/lib/auth-client'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export const Route = createFileRoute('/_authenticated/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const [isExiting, setIsExiting] = useState<boolean>(false)
  const router = useRouter()

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


  return (
    <AppLayout
      title="Settings"
      showBackButton
      onBackClick={() => {
        router.navigate({ to: "/" })
      }}
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
                <p className="text-foreground">{session?.data?.user.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-foreground">{session?.data?.user.email}</p>
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
