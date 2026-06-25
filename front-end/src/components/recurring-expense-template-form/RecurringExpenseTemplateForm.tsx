import z from 'zod'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppForm } from '@/hooks/form'
import type { FilterItems } from '@/components/filter/Filter.types'

const SCHEDULED_DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1))

const templateFormSchema = z.object({
  description: z
    .string()
    .min(1, 'Description is required')
    .max(255, 'Description must be 255 characters or less'),
  amount: z.number().positive('Amount must be greater than 0'),
  categoryId: z.string().refine((val) => val !== '', {
    message: 'You must specify a category',
  }),
  scheduledAt: z.string().refine((val) => /^(?:[1-9]|[12]\d|3[01])$/.test(val), {
    message: 'Select a day between 1 and 31',
  }),
})

export type RecurringExpenseTemplateFormValues = z.infer<
  typeof templateFormSchema
>

interface Props {
  formId: string
  categories: FilterItems
  defaultValues?: Partial<RecurringExpenseTemplateFormValues>
  onSubmit: (values: RecurringExpenseTemplateFormValues) => void
}

export default function RecurringExpenseTemplateForm({
  formId,
  categories,
  defaultValues,
  onSubmit,
}: Props) {
  const form = useAppForm({
    defaultValues: {
      description: defaultValues?.description ?? '',
      amount: defaultValues?.amount ?? 0,
      categoryId: defaultValues?.categoryId ?? '',
      scheduledAt: defaultValues?.scheduledAt ?? '1',
    },
    validators: { onSubmit: templateFormSchema },
    onSubmit: ({ value }) => onSubmit(value),
  })

  return (
    <form
      id={formId}
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <FieldGroup>
        <form.AppField
          name="description"
          children={(field) => (
            <field.TextField label="Description" placeholder="e.g. Netflix" />
          )}
        />
        <form.AppField
          name="amount"
          children={(field) => (
            <field.NumberField label="Amount" placeholder="0.00" />
          )}
        />
        <form.AppField
          name="categoryId"
          children={(field) => (
            <field.SearchableSelectField
              label="Category"
              filterItems={categories}
              placeHolder="Select Category"
            />
          )}
        />
        <form.AppField
          name="scheduledAt"
          children={(field) => {
            const isInvalid = !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Scheduled Day</FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger
                    id={field.name}
                    className="w-full"
                    aria-invalid={isInvalid}
                  >
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {SCHEDULED_DAYS.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />
      </FieldGroup>
    </form>
  )
}
