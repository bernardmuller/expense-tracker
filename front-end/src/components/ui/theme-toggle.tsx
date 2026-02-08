import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      className="text-muted-foreground hover:text-foreground aspect-square
        rounded-lg"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <Sun
        className="h-5 w-5 scale-100 rotate-0 transition-all dark:scale-0
          dark:-rotate-90"
      />
      <Moon
        className="absolute h-5 w-5 scale-0 rotate-90 transition-all
          dark:scale-100 dark:rotate-0"
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
