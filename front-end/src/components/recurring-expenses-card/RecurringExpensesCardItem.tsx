import { useId } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'

interface Props {
  description: string
  amount: string
  categoryLabel: string
  dueLabel?: string
  isPaid: boolean
  onToggle: (checked: boolean) => void
}

export default function RecurringExpensesCardItem({
  description,
  amount,
  categoryLabel,
  dueLabel,
  isPaid,
  onToggle,
}: Props) {
  const checkboxId = useId()

  return (
    <li className="flex items-center justify-between gap-2 py-3">
      <div className="flex flex-1 items-center gap-3">
        <label
          htmlFor={checkboxId}
          className={`flex flex-1 cursor-pointer flex-col ${isPaid ? 'opacity-60' : ''
            }`}
        >
          <span
            className={`font-medium ${isPaid ? 'text-foreground line-through' : 'text-foreground'
              }`}
          >
            {description}
          </span>
          <span className="text-muted-foreground text-sm">
            {amount} · {categoryLabel}
            {dueLabel ? ` · ${dueLabel}` : ''}
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
          <Checkbox
            id={checkboxId}
            className="size-6"
            checked={isPaid}
            onCheckedChange={(value) => onToggle(value === true)}
          />
        )}
      </div>
    </li>
  )
}
