import { faker } from "@faker-js/faker";
import type { FinancialAccount } from "../financialAccount";

export const generateMockFinancialAccount = (
  overwrites: Partial<FinancialAccount> = {},
): FinancialAccount => {
  return {
    id: faker.string.uuid(),
    type: "bank",
    name: faker.finance.accountName(),
    description: faker.lorem.sentence(),
    currentAmount: faker.number.float({ min: 0, max: 10000 }),
    ...overwrites,
  };
};

export const mockFinancialAccounts = (
  count: number = 10,
): FinancialAccount[] => {
  return Array.from({ length: count }, () => generateMockFinancialAccount());
};
