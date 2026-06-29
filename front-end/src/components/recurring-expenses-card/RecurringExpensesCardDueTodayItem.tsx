import { useId } from 'react'
import { CheckCircle2, Trash2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Props {
  description: string
  amount: string
  categoryLabel: string
  isPaid: boolean
  onToggle: (checked: boolean) => void
  onDelete?: () => void
}

export default function RecurringExpensesCardDueTodayItem({
  description,
  amount,
  categoryLabel,
  isPaid,
  onToggle,
  onDelete,
}: Props) {
  const checkboxId = useId()

  return (
    <li
      className="bg-primary/5 border-primary -mx-3 my-1 flex items-center
        justify-between gap-2 rounded-md border-l-2 px-3 py-3"
    >
      <div className="flex flex-1 items-start gap-3">
        <Checkbox
          id={checkboxId}
          className="mt-0.5 size-6"
          checked={isPaid}
          onCheckedChange={(value) => onToggle(value === true)}
        />
        <label
          htmlFor={checkboxId}
          className={`flex flex-1 cursor-pointer flex-col ${isPaid ? 'opacity-60' : ''
            }`}
        >
          <span
            className={`flex items-center gap-2 font-medium ${isPaid ? 'text-foreground line-through' : 'text-foreground'
              }`}
          >
            {description}
            <Badge variant="default">Due today</Badge>
          </span>
          <span className="text-muted-foreground text-sm">
            {amount} · {categoryLabel}
          </span>
        </label>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {isPaid ? (
          <span
            className="text-primary inline-flex items-center gap-1 text-xs
              font-medium"
          >
            <CheckCircle2 className="size-4" /> PAID
          </span>
        ) : (
          onDelete && (
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Remove ${description}`}
              onClick={onDelete}
            >
              <Trash2 className="size-4" />
            </Button>
          )
        )}
      </div>
    </li>
  )
}
