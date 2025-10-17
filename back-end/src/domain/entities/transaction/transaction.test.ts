import { generateUuid } from "@/lib/utils/generateUuid";
import { faker } from "@faker-js/faker";
import { beforeEach, describe, expect, it } from "vitest";
import {
  generateMockTransaction,
  mockExpenseTransactions,
} from "../__mocks__/transaction.mock";
import { transactionType } from "../enums/transactionType";
import {
  createTransaction,
  isExpenseTransaction,
  updateTransaction,
  type CreateTransactionParams,
  type Transaction,
} from "./index.js";

describe("createTransaction", () => {
  let mock: CreateTransactionParams;

  beforeEach(() => {
    mock = {
      budgetId: generateUuid(),
      categoryId: generateUuid(),
      type: transactionType.expense,
      amount: faker.number.float(),
      description: faker.lorem.text(),
    };
  });

  it("should create an expense with the provided type", () => {
    const result = createTransaction(mock);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.type).toBe(mock.type);
    }
  });

  it("should create an expense with the provided properties", () => {
    const result = createTransaction(mock);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.type).toBe(mock.type);
      expect(result.value.description).toBe(mock.description);
      expect(result.value.amount).toBe(mock.amount);
      expect(result.value.budgetId).toBe(mock.budgetId);
      expect(result.value.categoryId).toBe(mock.categoryId);
    }
  });

  it("should create an expense with an id", () => {
    const result = createTransaction(mock);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.id).toBeTruthy();
    }
  });
});

describe("updateTransaction", () => {
  let mock: Transaction;

  beforeEach(() => {
    mock = {
      id: generateUuid(),
      budgetId: generateUuid(),
      categoryId: generateUuid(),
      type: transactionType.expense,
      amount: faker.number.float(),
      description: faker.lorem.text(),
    };
  });

  it("should update the amount of a transaction", () => {
    const transactions = mockExpenseTransactions();
    for (const t of transactions) {
      const randomAmount = faker.number.float({
        max: 10000,
        fractionDigits: 1,
      });
      const update = {
        ...t,
        amount: randomAmount,
      };
      const result = updateTransaction(t, update);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.amount).toBe(randomAmount);
      }
    }
  });

  it("should error when trying to update the budget or category", () => {
    const update = {
      ...mock,
      budgetId: faker.string.uuid(),
      categoryId: faker.string.uuid(),
    };
    const result = updateTransaction(mock, update);
    expect(result.isErr()).toBe(true);
  });

  it("should error when trying to update the transaction ID", () => {
    const update = {
      ...mock,
      id: faker.string.uuid(),
    };
    const result = updateTransaction(mock, update);
    expect(result.isErr()).toBe(true);
  });

  it("should update the type of a transaction", () => {
    const transactions = mockExpenseTransactions();
    for (const t of transactions) {
      const randomBit = faker.number.binary();
      const randomType =
        randomBit === "1" ? transactionType.expense : transactionType.income;
      const update = {
        ...t,
        type: randomType,
      };
      const result = updateTransaction(t, update);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.type).toBe(randomType);
      }
    }
  });

  it("should update the description of a transaction", () => {
    const transactions = mockExpenseTransactions();
    for (const t of transactions) {
      const randomString = faker.lorem.words(
        faker.number.int({ min: 1, max: 10 }),
      );
      const update = {
        ...t,
        description: randomString,
      };
      const result = updateTransaction(t, update);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.description).toBe(randomString);
      }
    }
  });
});

describe("isExpenseTransaction", () => {
  let mock: Transaction;
  beforeEach(() => {
    mock = generateMockTransaction("expense");
  });
  it("should return true for expense transaction type", () => {
    mock.type = "expense";
    const result = isExpenseTransaction(mock);
    expect(result).toBe(true);
  });

  it("should return false for income transaction type", () => {
    mock.type = "income";
    const result = isExpenseTransaction(mock);
    expect(result).toBe(false);
  });

  it("should return false for transfer transaction type", () => {
    mock.type = "transfer";
    const result = isExpenseTransaction(mock);
    expect(result).toBe(false);
  });
});
