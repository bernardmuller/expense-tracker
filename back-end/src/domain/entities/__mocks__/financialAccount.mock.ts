import type { FinancialAccount } from "../financialAccount";
import { faker } from "@faker-js/faker";
import {
  financialAccountType,
  type FinancialAccountType,
} from "../enums/financialAccountType";

export const generateMockFinancialAccount = (
  overwrites: Partial<FinancialAccount> = {},
): FinancialAccount => {
  return {
    id: faker.string.uuid(),
    type: "bank",
    name: faker.finance.accountName(),
    description: faker.lorem.sentence(),
    currentAmount: faker.number.float({ min: 0, max: 10000 }),
    deletedAt: undefined,
    updatedAt: undefined,
    ...overwrites,
  };
};

export const mockFinancialAccounts = (
  count: number = 10,
): FinancialAccount[] => {
  return Array.from({ length: count }, () => generateMockFinancialAccount());
};

export const mockDeletedFinancialAccounts = (
  count: number = 10,
): FinancialAccount[] => {
  return Array.from({ length: count }, () =>
    generateMockFinancialAccount({
      deletedAt: faker.date.past().toISOString(),
    }),
  );
};
