import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import AppLayout from '../../AppLayout'
import { useSession, useUserActiveCategories } from '@/lib/hooks'
import { getCategoryInfo } from '@/lib/category-utils'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { useCreateBudgetWithCategories } from '@/lib/hooks/useCreateBudgetWithCategories'

interface OnboardingBudgetAllocatePageProps {
  budgetName: string
  startingAmount: number
}

export default function OnboardingBudgetAllocatePage({
  budgetName,
  startingAmount
}: OnboardingBudgetAllocatePageProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [categoryAllocations, setCategoryAllocations] = useState<Record<number, string>>({})

  const { data: session } = useSession()
  const userId = session?.data?.user.id
  const { data: userCategories, isLoading: categoriesLoading } = useUserActiveCategories(userId)

  const createBudgetMutation = useCreateBudgetWithCategories()

  const completeOnboardingMutation = useMutation({
    mutationFn: async (data: { userId: string }) => {
      const { completeOnboardingRoute } = await import('../../../server/routes/onboarding/completeOnboardingRoute')
      return completeOnboardingRoute({ data })
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['session'] })
      navigate({ to: '/' })
    }
  })

  const totalAllocated = useMemo(() => {
    return Object.values(categoryAllocations).reduce((sum, value) => {
      return sum + (parseFloat(value) || 0)
    }, 0)
  }, [categoryAllocations])

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
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['budgets'] })
        queryClient.invalidateQueries({ queryKey: ['activeBudget'] })
        completeOnboardingMutation.mutate({ userId })
      }
    })
  }

  if (categoriesLoading) {
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

  return (
    <AppLayout
      title="Allocate Budget"
      subtitle="Step 3 of 3"
      showBackButton
    >
      <div className="max-w-md mx-auto space-y-6">
        <div className="p-4 text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-muted-foreground">
            Allocate your budget across the categories you selected.
          </p>
        </div>

        <Card>
          <CardContent>
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

        <Button
          onClick={handleFinalizeBudget}
          disabled={createBudgetMutation.isPending || completeOnboardingMutation.isPending}
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-medium py-3"
        >
          {createBudgetMutation.isPending || completeOnboardingMutation.isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
              Completing Setup...
            </>
          ) : (
            'Complete Setup'
          )}
        </Button>
      </div>
    </AppLayout>
  )
}
