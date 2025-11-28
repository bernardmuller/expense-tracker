import { generateUuid } from "@/lib/utils/generateUuid";
import type { CategoryWithoutMetadata } from "@/features/categories/types";

export const generateMockCategory = (
  overrides?: Partial<CategoryWithoutMetadata>,
): CategoryWithoutMetadata => {
  const uuid = generateUuid();
  const categoryNames = [
    { key: "groceries", label: "Groceries", icon: "🛒" },
    { key: "transport", label: "Transport", icon: "🚗" },
    { key: "entertainment", label: "Entertainment", icon: "🎬" },
    { key: "utilities", label: "Utilities", icon: "💡" },
    { key: "health", label: "Health", icon: "🏥" },
    { key: "dining", label: "Dining", icon: "🍽️" },
    { key: "shopping", label: "Shopping", icon: "🛍️" },
    { key: "education", label: "Education", icon: "📚" },
  ];

  const randomCategory =
    categoryNames[Math.floor(Math.random() * categoryNames.length)];

  return {
    id: uuid,
    key: randomCategory.key,
    label: randomCategory.label,
    icon: randomCategory.icon,
    ...overrides,
  };
};

export const mockCategories = (
  count: number,
): CategoryWithoutMetadata[] => {
  return Array.from({ length: count }, (_, index) =>
    generateMockCategory({
      key: `category-${index}`,
      label: `Category ${index + 1}`,
    }),
  );
};
