import type { CategoryBudget } from "../categoryBudget";
import { faker } from "@faker-js/faker";

export const generateMockCategoryBudget = (
  overwrites: Partial<CategoryBudget> = {},
): CategoryBudget => {
  return {
    id: faker.string.uuid(),
    budgetId: faker.string.uuid(),
    categoryId: faker.string.uuid(),
    allocatedAmount: faker.number.float({ min: 0, max: 10000 }),
    deletedAt: undefined,
    updatedAt: undefined,
    ...overwrites,
  };
};

export const mockCategoryBudgets = (count: number = 10): CategoryBudget[] => {
  return Array.from({ length: count }, () => generateMockCategoryBudget());
};

export const mockDeletedCategoryBudgets = (
  count: number = 10,
): CategoryBudget[] => {
  return Array.from({ length: count }, () =>
    generateMockCategoryBudget({
      deletedAt: faker.date.past().toISOString(),
    }),
  );
};
