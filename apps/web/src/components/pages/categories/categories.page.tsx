import AppLayout from '../../AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  useAddUserCategory,
  useAllCategories,
  useRemoveUserCategory,
  useSession,
  useUserCategories,
} from '@/lib/hooks'

export default function CategoriesPage() {
  const { data: session } = useSession()
  const { data: allCategories, isLoading: allCategoriesLoading } = useAllCategories()
  const { data: userCategories, isLoading: userCategoriesLoading } = useUserCategories(session?.data?.user.id)
  const addUserCategory = useAddUserCategory()
  const removeUserCategory = useRemoveUserCategory()

  const userId = session?.data?.user.id
  const userCategoryIds = new Set(userCategories?.map(uc => uc.categoryId) || [])

  const handleCategoryToggle = async (categoryId: number, isChecked: boolean) => {
    if (userId) {
      if (isChecked) {
        await addUserCategory.mutateAsync({ userId, categoryId })
      } else {
        await removeUserCategory.mutateAsync({ userId, categoryId })
      }
    }
  }

  return (
    <AppLayout
      title="Category Settings"
      showBackButton
    >
      <Card>
        <CardHeader>
          <CardTitle>Expense Categories</CardTitle>
          <p className="text-sm text-muted-foreground">
            Select which categories you want to appear in your expense form. You need at least one category selected.
          </p>
        </CardHeader>
        <CardContent>
          {allCategoriesLoading || userCategoriesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading categories...</p>
            </div>
          ) : !allCategories || allCategories.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📋</div>
              <h3 className="text-lg font-semibold mb-2">No categories available</h3>
              <p className="text-muted-foreground mb-4">It looks like the categories haven't been loaded properly.</p>
              <Button onClick={() => window.location.reload()}>
                Reload Page
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {allCategories.map((category) => {
                const isSelected = userCategoryIds.has(category.id)
                const isUpdating = addUserCategory.isPending || removeUserCategory.isPending

                return (
                  <div key={category.id} className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-muted/20 transition-colors">

                    <label
                      htmlFor={category.id.toString()}
                      className="flex-1 flex items-center gap-3 text-sm cursor-pointer"
                    >
                      <span className="text-lg">{category.icon}</span>
                      <span className="font-medium">{category.label}</span>
                    </label>
                    <Checkbox
                      id={category.id.toString()}
                      checked={isSelected}
                      disabled={isUpdating}
                      onCheckedChange={(checked) =>
                        handleCategoryToggle(category.id, checked as boolean)
                      }
                    />
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  )
}
