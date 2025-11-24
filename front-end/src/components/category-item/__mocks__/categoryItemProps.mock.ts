import type { CategoryItemProps } from '../CategoryItem.types'

export const mockCategories: CategoryItemProps[] = [
  {
    id: 'groceries',
    icon: '🛒',
    name: 'Groceries',
  },
  {
    id: 'transport',
    icon: '🚗',
    name: 'Transport',
  },
  {
    id: 'entertainment',
    icon: '🎬',
    name: 'Entertainment',
  },
  {
    id: 'utilities',
    icon: '💡',
    name: 'Utilities',
  },
  {
    id: 'dining',
    icon: '🍽️',
    name: 'Dining Out',
  },
  {
    id: 'healthcare',
    icon: '🏥',
    name: 'Healthcare',
  },
]

export function getMockCategory(id: string): CategoryItemProps | undefined {
  return mockCategories.find((category) => category.id === id)
}
