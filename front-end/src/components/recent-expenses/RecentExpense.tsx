import { MoreVertical, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useIsMobile } from '@/hooks/use-mobile'

import type { RecentExpenseProps } from './RecentExpense.types'

export default function RecentExpense({
  description,
  amount,
  emoji,
  createdAt,
  onDelete,
}: RecentExpenseProps) {
  const isMobile = useIsMobile()

  return (
    <div className="flex items-center justify-between py-2 pr-3 md:pr-0">
      <div className="flex items-center gap-3">
        <div
          className="bg-muted flex h-10 w-10 items-center justify-center
            rounded-lg"
        >
          <span className="text-lg">{emoji}</span>
        </div>
        <div>
          <div className="flex items-center gap-1">
            <div className="font-grotesk text-sm font-medium">
              {description}
            </div>
          </div>
          <div className="text-muted-foreground text-xs">{createdAt}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-md font-semibold">{amount}</div>
        {onDelete && !isMobile && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onDelete}>
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}
