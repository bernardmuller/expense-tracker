import type { CategoryItemProps } from '../CategoryItem.types'

export const mockCategories: Array<CategoryItemProps> = [
  {
    id: 'groceries',
    icon: '🛒',
    label: 'Groceries',
  },
  {
    id: 'transport',
    icon: '🚗',
    label: 'Transport',
  },
  {
    id: 'entertainment',
    icon: '🎬',
    label: 'Entertainment',
  },
  {
    id: 'utilities',
    icon: '💡',
    label: 'Utilities',
  },
  {
    id: 'dining',
    icon: '🍽️',
    label: 'Dining Out',
  },
  {
    id: 'healthcare',
    icon: '🏥',
    label: 'Healthcare',
  },
]

export function getMockCategory(id: string): CategoryItemProps | undefined {
  return mockCategories.find((category) => category.id === id)
}
