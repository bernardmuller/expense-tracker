import type { UserCategory } from "../userCategory";
import { faker } from "@faker-js/faker";

export const generateMockUserCategory = (
  overwrites: Partial<UserCategory> = {},
): UserCategory => {
  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    categoryId: faker.string.uuid(),
    deletedAt: undefined,
    updatedAt: undefined,
    ...overwrites,
  };
};

export const mockUserCategories = (count: number = 10): UserCategory[] => {
  return Array.from({ length: count }, () => generateMockUserCategory());
};

export const mockDeletedUserCategories = (
  count: number = 10,
): UserCategory[] => {
  return Array.from({ length: count }, () =>
    generateMockUserCategory({
      deletedAt: faker.date.past().toISOString(),
    }),
  );
};
