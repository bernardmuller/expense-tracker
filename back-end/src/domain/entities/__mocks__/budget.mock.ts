import type { Budget } from '../budget';
import { faker } from '@faker-js/faker';

type GenerateMockBudgetParams = {
  mockBudget?: Budget
}

export const generateMockBudget = (overwrites: Partial<Budget> = {}): Budget => {
  const randomStartAmount = faker.number.int({ min: 1, max: 10000 });
  const randomCurrentAmount = faker.number.int({ min: 1, max: 10000 });
  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    name: faker.finance.accountName(),
    startAmount: randomStartAmount,
    currentAmount: randomCurrentAmount,
    isActive: faker.datatype.boolean(),
    ...overwrites
  }
};

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
