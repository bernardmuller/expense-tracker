import { useState } from 'react'
import CategorySelect from './CategorySelect'
import type { CategoryOption } from './CategorySelect';
import type { ExpenseCategory } from '@/db/schema'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUserActiveCategories } from '@/lib/hooks'
import useCreateExpense from '@/lib/hooks/useCreateExpense'

interface AddExpenseFormProps {
  defaultName: string
  defaultAmount: string
  budgetId: number
  userId: string
}

export default function AddExpenseForm({ budgetId, userId, defaultName, defaultAmount }: AddExpenseFormProps) {
  const [description, setDescription] = useState(defaultName)
  const [amount, setAmount] = useState(defaultAmount)
  const [category, setCategory] = useState<ExpenseCategory | ''>('')

  const { data: userCategories, isLoading: categoriesLoading } = useUserActiveCategories(userId)

  const categoryOptions: Array<CategoryOption> = userCategories?.map(cat => ({
    value: cat.key,
    label: `${cat.icon} ${cat.label}`
  })) || []

  const selectedOption = categoryOptions.find(option => option.value === category) || null

  const mutation = useCreateExpense({
    budgetId
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let desc;

    if (!amount || !category) {
      return
    }

    if (!description.trim()) {
      desc = category.at(0)?.toUpperCase().concat(category.slice(1))
    }

    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      return
    }

    mutation.mutate({
      budgetId,
      description: desc ?? description.trim(),
      amount: amountNum,
      category,
    })
  }

  const isSubmitDisabled = !amount || !category || mutation.isPending || categoriesLoading

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Expense name"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={mutation.isPending}
          />
          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            min="0"
            disabled={mutation.isPending}
          />
          <CategorySelect
            options={categoryOptions}
            value={selectedOption ?? undefined}
            onChange={(option) => setCategory(option ? option : '')}
            isLoading={categoriesLoading}
            isDisabled={mutation.isPending || categoriesLoading}
          />
          <Button
            type="submit"
            disabled={isSubmitDisabled}
            className="w-full"
          >
            {mutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2"></div>
                Adding...
              </>
            ) : (
              <>
                Add Expense
              </>
            )}
          </Button>
        </form>

        {mutation.error && (
          <div className="mt-4 p-3 bg-destructive/5 border border-destructive/50 rounded-md">
            <p className="text-destructive text-sm">
              Failed to add expense. Please try again.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
