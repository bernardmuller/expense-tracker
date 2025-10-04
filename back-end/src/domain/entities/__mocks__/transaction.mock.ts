import type { Transaction } from '../transaction';
import { transactionType, type TransactionType } from '../types/TransactionType';
import { faker } from '@faker-js/faker';

export const generateMockTransaction = (type: TransactionType): Transaction => ({
  id: faker.string.uuid(),
  budgetId: faker.string.uuid(),
  categoryId: faker.string.uuid(),
  type,
  amount: faker.number.float(),
  description: faker.string.octal()
});

export const mockExpenseTransactions = (count: number = 10): Transaction[] => {
  return Array.from({ length: count }, () => generateMockTransaction(transactionType.expense));
};

export const mockIncomeTransactions = (count: number = 10): Transaction[] => {
  return Array.from({ length: count }, () => generateMockTransaction(transactionType.income));
};

export const mockTransferTransactions = (count: number = 10): Transaction[] => {
  return Array.from({ length: count }, () => generateMockTransaction(transactionType.transfer));
};
