import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createBudget } from '../server/budgets'
import { queryKeys } from '../lib/query-client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Start New Budget</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="budgetName">
              Budget Name
            </Label>
            <Input
              type="text"
              id="budgetName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., January 2024, Monthly Budget"
              required
              disabled={mutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startAmount">
              Starting Amount
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-muted-foreground">R</span>
              <Input
                type="number"
                id="startAmount"
                value={startAmount}
                onChange={(e) => setStartAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="pl-8"
                required
                disabled={mutation.isPending}
              />
            </div>
            <p className="text-xs text-muted-foreground">
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
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending || !name.trim() || !startAmount}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {mutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating...
                </>
              ) : (
                'Create Budget'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
