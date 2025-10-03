import type { Budget } from '../budget';
import { faker } from '@faker-js/faker';

export const generateMockBudget = (): Budget => ({
  id: faker.number.int(),
  userId: faker.string.uuid(),
  name: faker.finance.accountName(),
  startAmount: faker.number.float({ min: 0, max: 10000 }),
  currentAmount: faker.number.float({ min: 0, max: 10000 }),
  isActive: faker.datatype.boolean(),
});

export const mockBudgets = (count: number = 10): Budget[] => {
  return Array.from({ length: count }, () => generateMockBudget());
};

export const mockActiveBudgets = (count: number = 10): Budget[] => {
  return Array.from({ length: count }, () => ({
    ...generateMockBudget(),
    isActive: true,
  }));
};

export const mockInactiveBudgets = (count: number = 10): Budget[] => {
  return Array.from({ length: count }, () => ({
    ...generateMockBudget(),
    isActive: false,
  }));
};
