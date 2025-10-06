import type { Category } from "../category";
import { faker } from "@faker-js/faker";

export const generateMockCategory = (
  overwrites: Partial<Category> = {},
): Category => {
  const key = faker.word.noun().toLowerCase().replace(/\s+/g, "-");
  return {
    id: faker.string.uuid(),
    key,
    label: faker.word.words(2),
    icon: faker.internet.emoji(),
    deletedAt: undefined,
    updatedAt: undefined,
    ...overwrites,
  };
};

export const mockCategories = (count: number = 10): Category[] => {
  return Array.from({ length: count }, () => generateMockCategory());
};

export const mockDeletedCategories = (count: number = 10): Category[] => {
  return Array.from({ length: count }, () =>
    generateMockCategory({
      deletedAt: faker.date.past().toISOString(),
    }),
  );
};
