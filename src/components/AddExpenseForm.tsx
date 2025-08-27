import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../lib/query-client'
import type { Budget, Expense, ExpenseCategory } from '../db/schema'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ReactSelect, { StylesConfig } from 'react-select'
import { useUserActiveCategories } from '@/lib/hooks'
import { ChevronDownIcon } from 'lucide-react'

// Import server function with proper typing but without direct import
const createExpense = async (data: { budgetId: number; description: string; amount: number; category: string }) => {
  const { createExpense } = await import('../server/expenses')
  return createExpense({ data })
}

interface AddExpenseFormProps {
  defaultName: string
  defaultAmount: string
  budgetId: number
  userId: string
}

interface CategoryOption {
  value: string
  label: string
}

const customStyles: StylesConfig<CategoryOption, false> = {
  control: (provided, state) => ({
    ...provided,
    minHeight: '40px',
    border: '1px solid rgb(228 228 231)', // --border equivalent
    borderRadius: '6px',
    backgroundColor: 'rgba(246,246,246, 0.4)', // light background to match inputs
    boxShadow: state.isFocused
      ? '0 0 0 1px rgba(234, 179, 8, 0.5)' // yellowish ring color to match other inputs
      : '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    borderColor: state.isFocused ? 'rgb(234 179 8)' : 'rgb(246 246 246)', // yellow : --border
    '&:hover': {
      borderColor: state.isFocused ? 'rgb(234 179 8)' : 'rgb(228 228 231)',
    },
    transition: 'color, box-shadow',
    outline: 'none',
    cursor: 'pointer',
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: '0 12px',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'rgb(113 113 122)', // --muted-foreground equivalent
    fontSize: '16px', // match input text size
    '@media (min-width: 768px)': {
      fontSize: '14px',
    },
    opacity: 1,
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'rgb(9 9 11)', // --foreground equivalent
    fontSize: '16px', // match input text size
    '@media (min-width: 768px)': {
      fontSize: '14px',
    },
  }),
  input: (provided) => ({
    ...provided,
    color: 'rgb(9 9 11)', // --foreground equivalent
    fontSize: '16px', // match input text size
    '@media (min-width: 768px)': {
      fontSize: '14px',
    },
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: 'rgb(255 255 255)', // --popover equivalent
    border: '1px solid rgb(228 228 231)', // --border equivalent
    borderRadius: '6px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    zIndex: 50,
  }),
  menuList: (provided) => ({
    ...provided,
    padding: '4px',
    backgroundColor: 'rgb(255 255 255)', // --popover equivalent
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused
      ? 'rgb(244 244 245)' // --accent equivalent
      : 'rgb(255 255 255)', // --popover equivalent
    color: state.isFocused
      ? 'rgb(9 9 11)' // --accent-foreground equivalent
      : 'rgb(9 9 11)', // --popover-foreground equivalent
    borderRadius: '4px',
    padding: '6px 8px',
    margin: '0',
    fontSize: '14px',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: 'rgb(244 244 245)', // --accent equivalent
    },
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: 'rgb(113 113 122)', // --muted-foreground equivalent
    padding: '8px',
    '&:hover': {
      color: 'rgb(113 113 122)',
    },
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
}

export default function AddExpenseForm({ budgetId, userId, defaultName, defaultAmount }: AddExpenseFormProps) {
  const [description, setDescription] = useState(defaultName)
  const [amount, setAmount] = useState(defaultAmount)
  const [category, setCategory] = useState<ExpenseCategory | ''>('')

  const queryClient = useQueryClient()
  const { data: userCategories, isLoading: categoriesLoading } = useUserActiveCategories(userId)

  const categoryOptions: CategoryOption[] = userCategories?.map(cat => ({
    value: cat.key,
    label: `${cat.icon} ${cat.label}`
  })) || []

  const selectedOption = categoryOptions.find(option => option.value === category) || null

  const mutation = useMutation({
    mutationFn: createExpense,
    onMutate: async (variables) => {
      // Skip optimistic updates during SSR
      if (typeof window === 'undefined') return

      await queryClient.cancelQueries({ queryKey: queryKeys.recentExpenses(budgetId) })
      await queryClient.cancelQueries({ queryKey: queryKeys.activeBudget(userId) })
      await queryClient.cancelQueries({ queryKey: queryKeys.allExpenses(budgetId) })

      const previousRecentExpenses = queryClient.getQueryData(queryKeys.recentExpenses(budgetId))
      const previousBudget = queryClient.getQueryData(queryKeys.activeBudget(userId))
      const previousAllExpenses = queryClient.getQueryData(queryKeys.allExpenses(budgetId))

      const optimisticExpense: Expense = {
        id: -Date.now(), // Use negative number for temp ID to avoid conflicts
        budgetId: variables.budgetId,
        description: variables.description,
        amount: variables.amount.toString(),
        category: variables.category,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      }

      queryClient.setQueryData(
        queryKeys.recentExpenses(budgetId),
        (old: Array<Expense> | undefined) => {
          if (!old) return [optimisticExpense]
          return [optimisticExpense, ...old.slice(0, 4)]
        }
      )

      queryClient.setQueryData(
        queryKeys.allExpenses(budgetId),
        (old: Array<Expense> | undefined) => {
          if (!old) return [optimisticExpense]
          return [optimisticExpense, ...old]
        }
      )

      queryClient.setQueryData(
        queryKeys.activeBudget(userId),
        (old: Budget | undefined | null) => {
          if (!old) return old
          const newCurrentAmount = parseFloat(old.currentAmount) - variables.amount
          return {
            ...old,
            currentAmount: newCurrentAmount.toString(),
            updatedAt: new Date(),
          }
        }
      )

      return { previousRecentExpenses, previousBudget, previousAllExpenses }
    },
    onError: (err, variables, context) => {
      if (context?.previousRecentExpenses) {
        queryClient.setQueryData(queryKeys.recentExpenses(budgetId), context.previousRecentExpenses)
      }
      if (context?.previousBudget) {
        queryClient.setQueryData(queryKeys.activeBudget(userId), context.previousBudget)
      }
      if (context?.previousAllExpenses) {
        queryClient.setQueryData(queryKeys.allExpenses(budgetId), context.previousAllExpenses)
      }
    },
    onSuccess: () => {
      setDescription('')
      setAmount('')
      setCategory('')

      queryClient.invalidateQueries({ queryKey: queryKeys.recentExpenses(budgetId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.activeBudget(userId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.allExpenses(budgetId) })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!description.trim() || !amount || !category) {
      return
    }

    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      return
    }

    mutation.mutate({
      budgetId,
      description: description.trim(),
      amount: amountNum,
      category,
    })
  }

  const isSubmitDisabled = !description.trim() || !amount || !category || mutation.isPending || categoriesLoading

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

          <ReactSelect<CategoryOption>
            options={categoryOptions}
            value={selectedOption}
            onChange={(option) => setCategory(option ? option.value as ExpenseCategory : '')}
            placeholder={categoriesLoading ? "Loading categories..." : "Category"}
            isLoading={categoriesLoading}
            isDisabled={mutation.isPending || categoriesLoading}
            styles={customStyles}
            components={{
              DropdownIndicator: ({ ...props }) => (
                <div {...props.innerProps} style={props.getStyles('dropdownIndicator', props)}>
                  <ChevronDownIcon className="size-4 opacity-50" />
                </div>
              ),
            }}
            isClearable={false}
            isSearchable={true}
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
