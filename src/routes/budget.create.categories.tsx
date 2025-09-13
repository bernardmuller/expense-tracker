import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft } from 'lucide-react'
import { z } from 'zod'
import AppLayout from '@/components/AppLayout'
import AuthForm from '@/components/AuthForm'
import { useSession, useUserActiveCategories, useCategoryBudgets } from '@/lib/hooks'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { getCategoryInfo } from '@/lib/category-utils'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/utils'

const createBudgetWithCategories = async (data: {
  userId: string;
  name: string;
  startAmount: number;
  categoryAllocations: Record<number, number>;
}) => {
  const { createBudgetWithCategories } = await import('../server/budgets')
  return createBudgetWithCategories({ data })
}

const searchSchema = z.object({
  budgetName: z.string(),
  startingAmount: z.number(),
  previousBudgetAmount: z.number().optional(),
})

export const Route = createFileRoute('/budget/create/categories')({
  component: BudgetCreateCategories,
  validateSearch: searchSchema,
})

function BudgetCreateCategories() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { budgetName, startingAmount } = Route.useSearch()

  const [categoryAllocations, setCategoryAllocations] = useState<Record<number, string>>({})

  const { data: session, isLoading: sessionLoading } = useSession()
  const userId = session?.data?.user.id

  const { data: userCategories, isLoading: categoriesLoading } = useUserActiveCategories(userId)
  const { data: previousCategoryBudgets, isLoading: categoryBudgetsLoading } = useCategoryBudgets({ userId })

  // Prepopulate category allocations with previous amounts
  useEffect(() => {
    if (previousCategoryBudgets && previousCategoryBudgets.length > 0) {
      const prepopulatedAllocations: Record<number, string> = {}
      previousCategoryBudgets.forEach((categoryBudget) => {
        if (categoryBudget.categoryId) {
          prepopulatedAllocations[categoryBudget.categoryId] = categoryBudget.allocatedAmount || ''
        }
      })
      setCategoryAllocations(prevAllocations => {
        // Only update if current allocations are empty to avoid overwriting user input
        const hasUserInput = Object.values(prevAllocations).some(value => value !== '')
        if (!hasUserInput) {
          return prepopulatedAllocations
        }
        return prevAllocations
      })
    }
  }, [previousCategoryBudgets])

  const createBudgetMutation = useMutation({
    mutationFn: createBudgetWithCategories,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['activeBudget'] })
      navigate({ to: '/' })
    },
  })

  const totalAllocated = useMemo(() => {
    return Object.values(categoryAllocations).reduce((sum, value) => {
      return sum + (parseFloat(value) || 0)
    }, 0)
  }, [categoryAllocations])

  const handleAuthSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['session'] })
  }

  const handleFinalizeBudget = () => {
    if (!userId) return

    const allocations: Record<number, number> = {}
    Object.entries(categoryAllocations).forEach(([categoryId, amount]) => {
      const numAmount = parseFloat(amount)
      if (!isNaN(numAmount) && numAmount > 0) {
        allocations[parseInt(categoryId)] = numAmount
      }
    })

    createBudgetMutation.mutate({
      userId,
      name: budgetName,
      startAmount: startingAmount,
      categoryAllocations: allocations,
    })
  }

  if (sessionLoading || categoriesLoading || categoryBudgetsLoading) {
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
      title="Start New Budget"
      subtitle='Step 2 of 2'
      showBackButton
    >
      <div className='flex flex-col gap-3'>
        <Card className="">
          <CardContent className="">
            <div className='flex flex-col gap-2'>
              <div className='w-full flex gap-3'>
                <span className="text-lg font-semibold">
                  R{formatCurrency(totalAllocated)}
                </span>
                <span className="text-lg text-muted-foreground">
                  of
                </span>
                <span className="text-lg font-semibold">
                  R{formatCurrency(startingAmount)}
                </span>
              </div>
              <Progress
                value={(totalAllocated / startingAmount) * 100}
              />
              <p className="text-sm text-muted-foreground mt-1">Allocate an amount you plan on spending on each category</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {userCategories?.map((userCategory) => {
            const categoryInfo = getCategoryInfo(userCategory.key, [userCategory])
            return (
              <Card key={userCategory.id} className="p-2">
                <CardContent className="p-0">
                  <div className="flex items-center gap-3">
                    <div className="p-1 rounded-lg bg-yellow-60">
                      <span className="text-white text-sm">{categoryInfo.icon || '📝'}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{categoryInfo.label}</p>
                    </div>
                    <div className="relative w-36">
                      <span className="absolute left-3 top-[11px] text-sm text-gray-400">R</span>
                      <Input
                        type="number"
                        value={Math.abs(Math.round(Number(categoryAllocations[userCategory.id]))) || ""}
                        onChange={(e) =>
                          setCategoryAllocations((prev) => ({
                            ...prev,
                            [userCategory.id]: e.target.value,
                          }))
                        }
                        placeholder="0"
                        className='pl-7'
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleFinalizeBudget}
            disabled={createBudgetMutation.isPending}
            className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-black font-medium"
          >
            {createBudgetMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating...
              </>
            ) : (
              'Create Budget'
            )}
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}
