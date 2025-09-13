import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'
import { useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { InfoIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import AppLayout from '@/components/AppLayout'
import AuthForm from '@/components/AuthForm'
import { useActiveBudget, useSession } from '@/lib/hooks'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/utils'

const searchSchema = z.object({
  previousBudgetAmount: z.number().optional(),
})

export const Route = createFileRoute('/budget/create/info')({
  component: BudgetCreateInfo,
  validateSearch: searchSchema,
})

function BudgetCreateInfo() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { previousBudgetAmount } = Route.useSearch()

  const [budgetName, setBudgetName] = useState(`Budget - ${format(new Date(), "dd MMM yyyy")}`)
  const [startingAmount, setStartingAmount] = useState(previousBudgetAmount?.toString() || '')

  const { data: session, isLoading: sessionLoading } = useSession()

  const userId = session?.data?.user.id
  const { data: budget, isLoading, error } = useActiveBudget({ userId })


  const handleAuthSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['session'] })
  }

  const handleContinueToCategories = () => {
    if (!budgetName.trim() || !startingAmount) {
      return
    }

    const amountNum = parseFloat(startingAmount)
    if (isNaN(amountNum) || amountNum <= 0) {
      return
    }

    navigate({
      to: '/budget/create/categories',
      search: {
        budgetName: budgetName.trim(),
        startingAmount: amountNum,
        previousBudgetAmount,
      }
    })
  }

  if (sessionLoading || isLoading) {
    return (
      <AppLayout>
        <div className="flex-1 flex flex h-[70vh] justify-center items-center">
          <div className='flex flex-col gap-1'>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!session?.data?.user) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <AuthForm onSuccess={handleAuthSuccess} />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout
      title="Start new Budget"
      subtitle='Step 1 of 2'
      showBackButton
    >
      <div className="min-h-screen text-white p-2">
        <div className="max-w-md mx-auto">
          <Card className="mb-6 py-2">
            <CardContent className="p-4 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Budget Name</label>
                <Input
                  type="text"
                  defaultValue={`Budget - ${format(new Date(), "dd/MM/yyyy")}`}
                  value={budgetName}
                  onChange={(e) => setBudgetName(e.target.value)}
                  placeholder="e.g., January 2024, Monthly Budget"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Starting Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-[8px] text-gray-400 text-md">R</span>
                  <Input
                    type="number"
                    value={startingAmount}
                    onChange={(e) => setStartingAmount(e.target.value)}
                    placeholder="120000"
                    className='pl-7'
                  />
                  <p className="text-sm text-gray-400 mt-2">This will be your total budget amount for the period</p>
                </div>
              </div>
              {previousBudgetAmount && (
                <Card className='py-4 border-primary/40 bg-primary/5'>
                  <CardTitle className='px-4'>
                    <div className='flex gap-2 items-center'>
                      <InfoIcon className='w-4 h-4 stroke-primary' />
                      <h3 className='text-md text-primary'>
                        Previous budget
                      </h3>
                    </div>
                  </CardTitle>
                  <CardContent className='px-4'>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-1">
                        <span className='text-muted-foreground text-sm'>
                          Leftover:
                        </span>
                        <p className="text-sm text-gray-300">R{formatCurrency(Number(budget?.currentAmount))}</p>
                      </div>
                      {budget?.currentAmount && (
                        <div className="flex flex-col gap-1">
                          <span className='text-muted-foreground text-sm'>
                            Starting amount + Leftover =
                          </span>
                          <p className="text-sm text-gray-300">
                            R{formatCurrency(Number(budget.startAmount) + Number(budget.currentAmount))}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Continue Button */}
          <Button
            onClick={handleContinueToCategories}
            disabled={!budgetName || !startingAmount}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-medium py-3"
          >
            Next
          </Button>
        </div>
      </div >
    </AppLayout >
  )
}
