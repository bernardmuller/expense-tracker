import { ThemeToggle } from '@/components/ui/theme-toggle'
import { ChevronLeft } from 'lucide-react'
import type React from 'react'

interface PageHeaderProps {
  title: string
  onBack: () => void
  actions?: React.ReactNode
}

export function PageHeader({ title, onBack, actions }: PageHeaderProps) {
  return (
    <header className="mb-4 grid grid-cols-3 items-center py-2">
      <button
        onClick={onBack}
        className="text-muted-foreground hover:text-foreground flex items-center
          gap-1 transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
        <span className="text-sm font-medium">Back</span>
      </button>
      <h1
        className="font-grotesk text-foreground text-center text-base
          font-semibold"
      >
        {title}
      </h1>
      <div className="flex items-center justify-end gap-1">{actions}</div>
    </header>
  )
}
