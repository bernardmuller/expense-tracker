import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createBudget } from '../server/budgets'
import { queryKeys } from '../lib/query-client'

interface StartNewBudgetModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  previousBudgetAmount?: number
}

export default function StartNewBudgetModal({
  isOpen,
  onClose,
  userId,
  previousBudgetAmount = 0
}: StartNewBudgetModalProps) {
  const [name, setName] = useState('')
  const [startAmount, setStartAmount] = useState(previousBudgetAmount.toString())

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets })
      queryClient.invalidateQueries({ queryKey: queryKeys.activeBudget(userId) })

      setName('')
      setStartAmount(previousBudgetAmount.toString())
      onClose()
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !startAmount) {
      return
    }

    const amountNum = parseFloat(startAmount)
    if (isNaN(amountNum) || amountNum <= 0) {
      return
    }

    mutation.mutate({
      data: {
        userId: userId,
        name: name.trim(),
        startAmount: amountNum,
      }
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Start New Budget</h2>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            disabled={mutation.isPending}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="budgetName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Budget Name
            </label>
            <input
              type="text"
              id="budgetName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., January 2024, Monthly Budget"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              required
              disabled={mutation.isPending}
            />
          </div>

          <div>
            <label htmlFor="startAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Starting Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">R</span>
              <input
                type="number"
                id="startAmount"
                value={startAmount}
                onChange={(e) => setStartAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                required
                disabled={mutation.isPending}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              This will be your total budget amount for the period
            </p>
          </div>

          {mutation.error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
              <p className="text-red-800 dark:text-red-400 text-sm">
                Failed to create budget. Please try again.
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              disabled={mutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending || !name.trim() || !startAmount}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${mutation.isPending || !name.trim() || !startAmount
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 dark:bg-green-500 text-white hover:bg-green-700 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
                }`}
            >
              {mutation.isPending ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating...
                </div>
              ) : (
                'Create Budget'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
