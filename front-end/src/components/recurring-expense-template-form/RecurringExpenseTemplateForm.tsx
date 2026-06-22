import z from 'zod'
import { FieldGroup } from '@/components/ui/field'
import { useAppForm } from '@/hooks/form'
import type { FilterItems } from '@/components/filter/Filter.types'

const templateFormSchema = z.object({
  description: z
    .string()
    .min(1, 'Description is required')
    .max(255, 'Description must be 255 characters or less'),
  amount: z.number().positive('Amount must be greater than 0'),
  categoryId: z.string().refine((val) => val !== '', {
    message: 'You must specify a category',
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
      </FieldGroup>
    </form>
  )
}
