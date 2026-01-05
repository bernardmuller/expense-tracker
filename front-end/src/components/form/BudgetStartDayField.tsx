import { useFieldContext } from '@/hooks/form-context'
import { useStore } from '@tanstack/react-form'
import { Field, FieldError, FieldLabel } from '../ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Input } from '../ui/input'
import type { BudgetFrequency } from '@/lib/utils/budget-dates'
import { getDayOfWeekName, getOrdinalDay } from '@/lib/utils/budget-dates'

interface BudgetStartDayFieldProps {
  label?: string
  placeholder?: string
  frequency: BudgetFrequency
}

export default function BudgetStartDayField({
  label,
  placeholder,
  frequency,
}: BudgetStartDayFieldProps) {
  const field = useFieldContext<number>()
  const isInvalid = useStore(field.store, (state) => !state.meta.isValid)
  const fieldValue = useStore(field.store, (state) => state.value)

  if (frequency === 'custom') {
    return (
      <Field data-invalid={isInvalid}>
        {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
        <Input
          id={field.name}
          name={field.name}
          type="number"
          min={1}
          max={365}
          value={fieldValue || ''}
          onBlur={field.handleBlur}
          placeholder={placeholder || 'Enter number of days'}
          onChange={(e) => {
            const value =
              e.target.value === '' ? 0 : parseInt(e.target.value, 10)
            field.handleChange(value)
          }}
          aria-invalid={isInvalid}
        />
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </Field>
    )
  }

  if (frequency === 'monthly') {
    const days = Array.from({ length: 31 }, (_, i) => i + 1)

    return (
      <Field data-invalid={isInvalid}>
        {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
        <Select
          value={fieldValue.toString()}
          onValueChange={(value) => field.handleChange(parseInt(value, 10))}
        >
          <SelectTrigger
            id={field.name}
            className="w-full"
            aria-invalid={isInvalid}
          >
            <SelectValue placeholder={placeholder || 'Select day of month'} />
          </SelectTrigger>
          <SelectContent>
            {days.map((day) => (
              <SelectItem key={day} value={day.toString()}>
                {getOrdinalDay(day)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </Field>
    )
  }

  if (frequency === 'weekly' || frequency === 'bi-weekly') {
    const daysOfWeek = Array.from({ length: 7 }, (_, i) => ({
      value: i,
      label: getDayOfWeekName(i),
    }))

    return (
      <Field data-invalid={isInvalid}>
        {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
        <Select
          value={fieldValue.toString()}
          onValueChange={(value) => field.handleChange(parseInt(value, 10))}
        >
          <SelectTrigger
            id={field.name}
            className="w-full"
            aria-invalid={isInvalid}
          >
            <SelectValue placeholder={placeholder || 'Select day of week'} />
          </SelectTrigger>
          <SelectContent>
            {daysOfWeek.map((day) => (
              <SelectItem key={day.value} value={day.value.toString()}>
                {day.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </Field>
    )
  }

  return null
}
