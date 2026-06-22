import { useMemo, useRef, useState } from 'react'
import { CheckCircle2, Trash2 } from 'lucide-react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { getBudgetRecurringExpensesQueryOptions } from '@/lib/http/queries/recurring-expenses/getBudgetRecurringExpenses'
import type { BudgetRecurringExpense } from '@/lib/http/queries/recurring-expenses/getBudgetRecurringExpenses'
import { getCategoriesQueryOptions } from '@/lib/http/queries/categories'
import { useUpdateRecurringExpenseStatus } from '@/lib/http/hooks/use-update-recurring-expense-status'
import { useDeleteRecurringExpenseInstance } from '@/lib/http/hooks/use-delete-recurring-expense-instance'
import { formatCurrency } from '@/lib/utils/formatting/formatCurrency'
import MarkRecurringExpensePaidDialog from '@/components/mark-recurring-expense-paid-dialog/MarkRecurringExpensePaidDialog'

const DEBOUNCE_MS = 200

interface Props {
  budgetId: string
}

export default function RecurringExpensesCard({ budgetId }: Props) {
  const { data: response } = useSuspenseQuery(
    getBudgetRecurringExpensesQueryOptions(budgetId),
  )
  const { data: categoriesResponse } = useSuspenseQuery(
    getCategoriesQueryOptions(),
  )
  const updateStatusMutation = useUpdateRecurringExpenseStatus()
  const deleteMutation = useDeleteRecurringExpenseInstance()

  const instances = response.recurringExpenses
  const categoriesById = useMemo(
    () =>
      new Map(categoriesResponse.categories.map((c) => [c.id, c])),
    [categoriesResponse.categories],
  )
  const categoryOptions = useMemo(
    () =>
      categoriesResponse.categories.map((c) => ({
        value: c.id,
        label: `${c.icon} ${c.label}`,
      })),
    [categoriesResponse.categories],
  )

  const [markPaidTarget, setMarkPaidTarget] =
    useState<BudgetRecurringExpense | null>(null)
  const [pendingDelete, setPendingDelete] =
    useState<BudgetRecurringExpense | null>(null)
  const [pendingUnpaid, setPendingUnpaid] =
    useState<BudgetRecurringExpense | null>(null)

  const unpaidTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  )

  const handleCheckboxToggle = (
    instance: BudgetRecurringExpense,
    nextChecked: boolean,
  ) => {
    if (nextChecked && !instance.isPaid) {
      setMarkPaidTarget(instance)
      return
    }
    if (!nextChecked && instance.isPaid) {
      setPendingUnpaid(instance)
    }
  }

  const handleConfirmUnpaid = () => {
    if (!pendingUnpaid) return
    const instance = pendingUnpaid
    setPendingUnpaid(null)
    const existing = unpaidTimers.current.get(instance.id)
    if (existing) clearTimeout(existing)
    const timer = setTimeout(() => {
      unpaidTimers.current.delete(instance.id)
      updateStatusMutation.mutate({
        budgetId,
        instanceId: instance.id,
        body: { isPaid: false },
      })
    }, DEBOUNCE_MS)
    unpaidTimers.current.set(instance.id, timer)
  }

  const handleMarkPaidSubmit = (
    instance: BudgetRecurringExpense,
    values: {
      description: string
      amount: number
      categoryId: string
      createdAt?: string
      note?: string
    },
  ) => {
    updateStatusMutation.mutate(
      {
        budgetId,
        instanceId: instance.id,
        body: {
          isPaid: true,
          expenseData: values,
        },
      },
      {
        onSuccess: (result) => {
          if (result.isOk()) setMarkPaidTarget(null)
        },
      },
    )
  }

  const handleConfirmDelete = () => {
    if (!pendingDelete) return
    const instance = pendingDelete
    setPendingDelete(null)
    deleteMutation.mutate({ budgetId, instanceId: instance.id })
  }

  if (instances.length === 0) return null

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Recurring Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-border divide-y">
              {instances.map((instance) => {
                const category = instance.categoryId
                  ? categoriesById.get(instance.categoryId)
                  : undefined
                return (
                  <li
                    key={instance.id}
                    className="flex items-center justify-between gap-2 py-3"
                  >
                    <div className="flex flex-1 items-start gap-3">
                      <Checkbox
                        id={`instance-${instance.id}`}
                        className="mt-1"
                        checked={instance.isPaid}
                        onCheckedChange={(value) =>
                          handleCheckboxToggle(instance, value === true)
                        }
                      />
                      <label
                        htmlFor={`instance-${instance.id}`}
                        className={`flex flex-1 cursor-pointer flex-col ${
                          instance.isPaid ? 'opacity-60' : ''
                        }`}
                      >
                        <span
                          className={`font-medium ${
                            instance.isPaid
                              ? 'text-foreground line-through'
                              : 'text-foreground'
                          }`}
                        >
                          {instance.description}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          {formatCurrency(parseFloat(instance.amount), 'za')}
                          {category
                            ? ` · ${category.icon} ${category.label}`
                            : ' · (deleted category)'}
                        </span>
                      </label>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      {instance.isPaid ? (
                        <span
                          className="text-primary inline-flex items-center
                            gap-1 text-xs font-medium"
                        >
                          <CheckCircle2 className="size-4" /> PAID
                        </span>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Remove ${instance.description}`}
                          onClick={() => setPendingDelete(instance)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </div>
                  </li>
                )
              })}
          </ul>
        </CardContent>
      </Card>

      {markPaidTarget && (
        <MarkRecurringExpensePaidDialog
          open={markPaidTarget !== null}
          onOpenChange={(open) => {
            if (!open) setMarkPaidTarget(null)
          }}
          categories={categoryOptions}
          isSubmitting={updateStatusMutation.isPending}
          defaultValues={{
            description: markPaidTarget.description,
            amount: parseFloat(markPaidTarget.amount),
            categoryId: markPaidTarget.categoryId ?? '',
          }}
          onSubmit={(values) =>
            handleMarkPaidSubmit(markPaidTarget, values)
          }
        />
      )}

      <AlertDialog
        open={pendingUnpaid !== null}
        onOpenChange={(open) => {
          if (!open) setPendingUnpaid(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Unmark "{pendingUnpaid?.description}" as paid?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will soft-delete the recorded expense and restore the
              amount to your budget.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-white"
              onClick={handleConfirmUnpaid}
            >
              Unmark
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Remove "{pendingDelete?.description}" from this budget?
            </AlertDialogTitle>
            <AlertDialogDescription>
              The recurring expense template is unaffected — only this
              budget's instance is removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-white"
              onClick={handleConfirmDelete}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
