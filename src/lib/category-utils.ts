import type { Category } from '../db/schema'

export interface CategoryInfo {
  key: string
  label: string
  icon: string
}

export function getCategoryInfo(
  categoryKey: string,
  allCategories: Category[] | undefined
): CategoryInfo {
  const category = allCategories?.find(cat => cat.key === categoryKey)
  
  if (category) {
    return {
      key: category.key,
      label: category.label,
      icon: category.icon || '💰',
    }
  }

  return {
    key: categoryKey,
    label: categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1).replace(/-/g, ' '),
    icon: '💰',
  }
}

export function getCategoryLabel(
  categoryKey: string,
  allCategories: Category[] | undefined
): string {
  return getCategoryInfo(categoryKey, allCategories).label
}

export function getCategoryIcon(
  categoryKey: string,
  allCategories: Category[] | undefined
): string {
  return getCategoryInfo(categoryKey, allCategories).icon
}