import { useMemo, useState } from "react"
import BudgetBreakdownItem from "./budget-breakdown-item"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils/cn"

export interface CategoryData {
  id: number
  key: string
  name: string
  spent: number
  planned: number | null
  icon: string
}

interface MinimalistListProps {
  categories: Array<CategoryData>
  onCategoryClick: (key: string) => void;
}

export function BudgetBreakdownList({ categories, onCategoryClick }: MinimalistListProps) {
  const [filteredCategory, setFilteredCategory] = useState<string | null>(null)

  const filteredCategories = useMemo(() => {
    if (filteredCategory === "all" || !filteredCategory) return categories
    return categories.filter(cat => cat.id.toString() === filteredCategory)
  }, [filteredCategory, categories])

  if (categories.length === 0) {
    return (
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-4xl mb-4">📊</div>
          <h2 className="text-md font-bold mb-2">No Expenses Yet</h2>
          <p className="text-sm text-muted-foreground max-w-60 mx-auto">Start adding expenses to see your budget breakdown.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      <div className='flex w-full justify-between items-center'>
        <h3>Breakdown</h3>
        <Select onValueChange={(value) => setFilteredCategory(value)}>
          <SelectTrigger className={cn({ 'w-[90px]': filteredCategory === null })}>
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="all" value="all">All</SelectItem>
            {categories.map(category =>
              <SelectItem key={category.id} value={category.id.toString()}>{category.name}</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      {filteredCategories.map((category) => {
        const percentage = category.planned ? Math.min((category.spent / category.planned) * 100, 100) : 0;
        const isOverBudget = category.planned ? category.spent > category.planned : false
        const isUnplanned = !category.planned && category.spent > 0;
        return (
          <BudgetBreakdownItem
            key={category.id.toString()}
            name={category.name}
            icon={category.icon}
            planned={category.planned ?? 0}
            spent={category.spent}
            percentage={percentage}
            isOverBudget={isOverBudget}
            isUnplanned={isUnplanned}
            onClick={() => onCategoryClick(category.key)}
          />
        )
      })}
    </div>
  )
}
