import { faker } from "@faker-js/faker";
import type { UserCategory } from "../userCategory";

export const generateMockUserCategory = (
  overwrites: Partial<UserCategory> = {},
): UserCategory => {
  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    categoryId: faker.string.uuid(),
    ...overwrites,
  };
};

export const mockUserCategories = (count: number = 10): UserCategory[] => {
  return Array.from({ length: count }, () => generateMockUserCategory());
};
