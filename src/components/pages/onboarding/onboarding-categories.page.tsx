import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import AppLayout from '../../AppLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { defaultCategories } from '@/lib/constants/default-categories'
import { useSession } from '@/lib/hooks'

export default function OnboardingCategoriesPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedCategories, setSelectedCategories] = useState<Array<string>>([])
  const { data: session } = useSession()
  const userId = session?.data?.user.id

  const saveUserCategoriesMutation = useMutation({
    mutationFn: async (data: { userId: string; categoryKeys: Array<string> }) => {
      const { createUserCategoriesRoute } = await import('../../../server/routes/categories/createUserCategoriesRoute')
      return createUserCategoriesRoute({ data })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userCategories'] })
      navigate({ to: '/onboarding/budget/info' })
    }
  })

  const handleCategoryToggle = (categoryKey: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryKey)
        ? prev.filter(key => key !== categoryKey)
        : [...prev, categoryKey]
    )
  }

  const handleContinue = async () => {
    if (!userId || selectedCategories.length === 0) return

    saveUserCategoriesMutation.mutate({
      userId,
      categoryKeys: selectedCategories
    })
  }

  const isLoading = saveUserCategoriesMutation.isPending

  return (
    <AppLayout
      title="Choose Categories"
      subtitle="Step 1 of 4"
      showBackButton
    >
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center py-4">
          <div className="text-4xl mb-2">📂</div>
          <p className="text-muted-foreground">
            Select the spending categories that best fit your lifestyle. You can always add more later.
          </p>
        </div>

        <div className="space-y-3">
          {defaultCategories.map((category) => (
            <Card
              key={category.key}
              className={`cursor-pointer transition-colors ${selectedCategories.includes(category.key)
                ? 'border-primary bg-primary/5'
                : 'hover:bg-muted/50'
                }`}
              onClick={() => handleCategoryToggle(category.key)}
            >
              <CardContent className="">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-2xl">{category.icon}</div>
                    <div>
                      <p className="font-medium">{category.label}</p>
                    </div>
                  </div>
                  <Checkbox
                    checked={selectedCategories.includes(category.key)}
                    onChange={() => handleCategoryToggle(category.key)}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground text-center">
            {selectedCategories.length === 0
              ? "Please select at least one category to continue"
              : `${selectedCategories.length} categories selected`
            }
          </p>

          <Button
            onClick={handleContinue}
            disabled={selectedCategories.length === 0 || isLoading}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-medium py-3"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                Setting up...
              </>
            ) : (
              'Continue to Budget Info'
            )}
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}
