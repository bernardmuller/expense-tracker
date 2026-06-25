import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import RecurringExpenseTemplateForm from '../recurring-expense-template-form/RecurringExpenseTemplateForm'
import type { RecurringExpenseTemplateFormValues } from '../recurring-expense-template-form/RecurringExpenseTemplateForm'
import {
  getUserRecurringExpensesQueryOptions,
  type RecurringExpenseTemplate,
} from '@/lib/http/queries/recurring-expenses/getUserRecurringExpenses'
import { getCategoriesQueryOptions } from '@/lib/http/queries/categories'
import { useCreateRecurringExpense } from '@/lib/http/hooks/use-create-recurring-expense'
import { useUpdateRecurringExpense } from '@/lib/http/hooks/use-update-recurring-expense'
import { useDeleteRecurringExpense } from '@/lib/http/hooks/use-delete-recurring-expense'

type Mode =
  | { kind: 'closed' }
  | { kind: 'create' }
  | { kind: 'edit'; template: RecurringExpenseTemplate }

interface Props {
  userId: string
}

const formatAmount = (amount: string) =>
  new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 2,
  }).format(parseFloat(amount))

export default function RecurringExpenseTemplateList({ userId }: Props) {
  const { data: templatesResponse } = useSuspenseQuery(
    getUserRecurringExpensesQueryOptions(userId),
  )
  const { data: categoriesResponse } = useSuspenseQuery(
    getCategoriesQueryOptions(),
  )

  const templates = templatesResponse.templates
  const categories = categoriesResponse.categories
  const categoriesById = new Map(categories.map((c) => [c.id, c]))
  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: `${c.icon} ${c.label}`,
  }))

  const [mode, setMode] = useState<Mode>({ kind: 'closed' })
  const [pendingDelete, setPendingDelete] =
    useState<RecurringExpenseTemplate | null>(null)

  const createMutation = useCreateRecurringExpense()
  const updateMutation = useUpdateRecurringExpense()
  const deleteMutation = useDeleteRecurringExpense()

  const handleSubmit = (values: RecurringExpenseTemplateFormValues) => {
    if (mode.kind === 'create') {
      createMutation.mutate(values)
      setMode({ kind: 'closed' })
    } else if (mode.kind === 'edit') {
      updateMutation.mutate(
        { templateId: mode.template.id, body: values },
        {
          onSuccess: (result) => {
            if (result.isOk()) setMode({ kind: 'closed' })
          },
        },
      )
    }
  }

  const handleConfirmDelete = () => {
    if (!pendingDelete) return
    deleteMutation.mutate(
      { templateId: pendingDelete.id },
      {
        onSettled: () => setPendingDelete(null),
      },
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recurring Expenses</CardTitle>
          <Button
            size="sm"
            onClick={() => setMode({ kind: 'create' })}
            data-slot="add-recurring-expense"
          >
            <Plus className="size-4" />
            Add
          </Button>
        </CardHeader>
        <CardContent>
          {templates.length === 0 ? (
            <p className="text-muted-foreground py-6 text-center text-sm">
              No recurring expenses yet. Add one to have it appear on every
              new budget.
            </p>
          ) : (
            <ul className="divide-border divide-y">
              {templates.map((template) => {
                const category = template.categoryId
                  ? categoriesById.get(template.categoryId)
                  : undefined
                return (
                  <li
                    key={template.id}
                    className="flex items-center justify-between gap-2 py-3"
                  >
                    <div className="flex min-w-0 flex-col">
                      <span className="text-foreground truncate font-medium">
                        {template.description}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        {formatAmount(template.amount)}
                        {category
                          ? ` · ${category.icon} ${category.label}`
                          : ' · (deleted category)'}
                      </span>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Edit ${template.description}`}
                        onClick={() =>
                          setMode({ kind: 'edit', template })
                        }
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${template.description}`}
                        onClick={() => setPendingDelete(template)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={mode.kind !== 'closed'}
        onOpenChange={(open) => {
          if (!open) setMode({ kind: 'closed' })
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {mode.kind === 'edit'
                ? 'Edit recurring expense'
                : 'Add recurring expense'}
            </DialogTitle>
            <DialogDescription>
              Define a recurring expense to apply to future budgets. Existing
              budgets aren't affected.
            </DialogDescription>
          </DialogHeader>
          {mode.kind !== 'closed' && (
            <RecurringExpenseTemplateForm
              formId="recurring-expense-template-form"
              categories={categoryOptions}
              defaultValues={
                mode.kind === 'edit'
                  ? {
                    description: mode.template.description,
                    amount: parseFloat(mode.template.amount),
                    categoryId: mode.template.categoryId ?? '',
                    scheduledAt: mode.template.scheduledAt,
                  }
                  : undefined
              }
              onSubmit={handleSubmit}
            />
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setMode({ kind: 'closed' })}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="recurring-expense-template-form"
              disabled={
                createMutation.isPending || updateMutation.isPending
              }
            >
              {mode.kind === 'edit' ? 'Save changes' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete recurring expense?</AlertDialogTitle>
            <AlertDialogDescription>
              "{pendingDelete?.description}" will stop showing up on new
              budgets. Existing budget instances aren't affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-white"
              onClick={handleConfirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
