import type { CategoriesByUserId } from '@/server/queries/categories'

export interface CategoryInfo {
  key: string
  label: string
  icon: string | null
}

export function getCategoryInfo(
  key: string,
  categories: CategoriesByUserId
): CategoryInfo {
  const category = categories.find((cat: CategoriesByUserId[0]) => cat.key === key)

  if (category) {
    return {
      key: category.key,
      label: category.label,
      icon: category.icon || null,
    }
  }

  return {
    key: key,
    label: key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, ' '),
    icon: null,
  }
}

export function getCategoryLabel(
  key: string,
  categories: CategoriesByUserId
): string {
  return getCategoryInfo(key, categories).label
}

export function getCategoryIcon(
  key: string,
  categories: CategoriesByUserId
): string | null {
  return getCategoryInfo(key, categories).icon
}
