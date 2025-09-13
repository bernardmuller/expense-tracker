import { useMemo, useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Badge } from "../ui/badge"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface CategoryData {
  id: string
  key: string
  name: string
  spent: number
  planned: number
  icon: string
  color: string
}

interface MinimalistListProps {
  categories: Array<CategoryData>
}

export function ProgressBreakdown({ categories }: MinimalistListProps) {
  const navigate = useNavigate();
  const [filteredCategory, setFilteredCategory] = useState<string | null>(null)

  const filteredCategories = useMemo(() => {
    if (filteredCategory === "all" || !filteredCategory) return categories
    return categories.filter(cat => cat.id === filteredCategory)
  }, [filteredCategory, categories])

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
              <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
            )})
          </SelectContent>
        </Select>
      </div>

      {filteredCategories.map((category) => {
        const percentage = Math.min((category.spent / category.planned) * 100, 100)
        const isOverBudget = category.spent > category.planned

        return (
          <Card
            key={category.id}
            className="p-4 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer border-border/50"
            onClick={() => navigate({
              to: "/expenses",
              search: {
                filter: category.key
              }
            })}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg">{category.icon}</span>
                <h3 className="font-semibold text-foreground text-lg">{category.name}</h3>
              </div>
              {isOverBudget && (
                <Badge variant="destructive">Over budget</Badge>
              )}
            </div>
            <div className="space-y-2">
              <Progress
                value={percentage}
                className="h-1"
                isError={isOverBudget}
              />

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">Spent: R{category.spent.toLocaleString()}</span>
                <span className="text-muted-foreground">Planned: R{category.planned.toLocaleString()}</span>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
