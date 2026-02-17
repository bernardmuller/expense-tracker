import { useFieldContext } from '@/hooks/form-context'
import { useStore } from '@tanstack/react-form'
import { format, parseISO } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Field, FieldError, FieldLabel } from '../ui/field'

export default function DateField({
  label,
  min,
  max,
}: {
  label?: string
  min?: Date
  max?: Date
}) {
  const field = useFieldContext<string>()
  const isInvalid = useStore(field.store, (state) => !state.meta.isValid)

  const selectedDate = field.state.value ? parseISO(field.state.value) : undefined

  const handleSelect = (date: Date | undefined) => {
    field.handleChange(date ? format(date, 'yyyy-MM-dd') : '')
  }

  const isDisabled = (date: Date) => {
    if (max && date > max) return true
    if (min && date < min) return true
    return false
  }

  return (
    <Field data-invalid={isInvalid}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-empty={!selectedDate}
            className={cn(
              'data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal',
              isInvalid && 'border-destructive',
            )}
            aria-invalid={isInvalid}
          >
            <CalendarIcon />
            {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            disabled={isDisabled}
          />
        </PopoverContent>
      </Popover>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
