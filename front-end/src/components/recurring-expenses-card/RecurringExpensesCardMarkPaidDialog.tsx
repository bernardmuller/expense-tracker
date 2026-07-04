import z from 'zod'
import { useAppForm } from '@/hooks/form'
import { FieldGroup } from '@/components/ui/field'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { FilterItems } from '@/components/filter/Filter.types'

const markPaidSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.number().positive('Amount must be greater than 0'),
  categoryId: z.string().refine((v) => v !== '', {
    message: 'You must select a category',
  }),
  createdAt: z.string(),
  note: z.string(),
})

type MarkPaidSubmitValues = {
  description: string
  amount: number
  categoryId: string
  createdAt?: string
  note?: string
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: FilterItems
  isSubmitting?: boolean
  defaultValues: {
    description: string
    amount: number
    categoryId: string
  }
  onSubmit: (values: MarkPaidSubmitValues) => void
}

export default function RecurringExpensesCardMarkPaidDialog({
  open,
  onOpenChange,
  categories,
  isSubmitting,
  defaultValues,
  onSubmit,
}: Props) {
  const form = useAppForm({
    defaultValues: {
      description: defaultValues.description,
      amount: defaultValues.amount,
      categoryId: defaultValues.categoryId,
      createdAt: '',
      note: '',
    },
    validators: { onSubmit: markPaidSchema },
    onSubmit: ({ value }) => {
      onSubmit({
        description: value.description,
        amount: value.amount,
        categoryId: value.categoryId,
        createdAt: value.createdAt || undefined,
        note: value.note || undefined,
      })
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mark as paid</DialogTitle>
          <DialogDescription>
            Confirm the expense details — you can edit before recording it.
          </DialogDescription>
        </DialogHeader>
        <form
          id="mark-recurring-paid-form"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.AppField
              name="description"
              children={(field) => (
                <field.TextField
                  label="Description"
                  placeholder="Expense name"
                />
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
              name="createdAt"
              children={(field) => (
                <field.DateField label="Date" max={new Date()} />
              )}
            />
            <form.AppField
              name="note"
              children={(field) => (
                <field.TextAreaField
                  label="Note"
                  placeholder="Optional note"
                />
              )}
            />
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="mark-recurring-paid-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving…' : 'Create Expense'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
