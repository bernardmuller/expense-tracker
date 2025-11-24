import type {
  CategoryItemProps,
  SelectableCategoryItemProps,
} from '../CategoryItem.types'

export function createCategoryItemProps(
  overrides?: Partial<CategoryItemProps>,
): CategoryItemProps {
  return {
    id: 'groceries',
    icon: '🛒',
    name: 'Groceries',
    ...overrides,
  }
}

export function createSelectableCategoryItemProps(
  overrides?: Partial<SelectableCategoryItemProps>,
): SelectableCategoryItemProps {
  return {
    ...createCategoryItemProps(),
    checked: false,
    onCheckedChange: () => {},
    ...overrides,
  }
}
