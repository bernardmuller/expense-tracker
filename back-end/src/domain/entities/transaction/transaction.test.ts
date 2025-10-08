import { describe, expect, beforeEach } from "vitest";
import { it as effectIt } from "@effect/vitest";
import { Effect, Exit } from "effect";
import {
  createTransaction,
  updateTransaction,
  type CreateTransactionParams,
  type Transaction,
} from "./index.js";
import { transactionType } from "../enums/transactionType";
import { faker } from "@faker-js/faker";
import { generateUuid } from "@/lib/utils/generateUuid";
import { mockExpenseTransactions } from "../__mocks__/transaction.mock";

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

  effectIt.effect("should create an expense with the provided type", () =>
    Effect.gen(function* () {
      const result = yield* createTransaction(mock);
      expect(result.type).toBe(mock.type);
    }),
  );

  effectIt.effect("should create an expense with the provided properties", () =>
    Effect.gen(function* () {
      const result = yield* createTransaction(mock);
      expect(result.type).toBe(mock.type);
      expect(result.description).toBe(mock.description);
      expect(result.amount).toBe(mock.amount);
      expect(result.budgetId).toBe(mock.budgetId);
      expect(result.categoryId).toBe(mock.categoryId);
    }),
  );

  effectIt.effect("should create an expense with an id", () =>
    Effect.gen(function* () {
      const result = yield* createTransaction(mock);
      expect(result.id).toBeTruthy();
    }),
  );
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

  effectIt.effect("should update the amount of a transaction", () =>
    Effect.gen(function* () {
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
        const result = yield* updateTransaction(t, update);
        expect(result.amount).toBe(randomAmount);
      }
    }),
  );

  effectIt.effect(
    "should error when trying to update the budget or category",
    () =>
      Effect.gen(function* () {
        const update = {
          ...mock,
          budgetId: faker.string.uuid(),
          categoryId: faker.string.uuid(),
        };
        const result = yield* Effect.exit(updateTransaction(mock, update));
        expect(Exit.isFailure(result)).toBe(true);
      }),
  );

  effectIt.effect("should error when trying to update the transaction ID", () =>
    Effect.gen(function* () {
      const update = {
        ...mock,
        id: faker.string.uuid(),
      };
      const result = yield* Effect.exit(updateTransaction(mock, update));
      expect(Exit.isFailure(result)).toBe(true);
    }),
  );

  effectIt.effect("should error when trying to update the transaction ID", () =>
    Effect.gen(function* () {
      const update = {
        ...mock,
        id: faker.string.uuid(),
      };
      const result = yield* Effect.exit(updateTransaction(mock, update));
      expect(Exit.isFailure(result)).toBe(true);
    }),
  );

  effectIt.effect("should update the type of a transaction", () =>
    Effect.gen(function* () {
      const transactions = mockExpenseTransactions();
      for (const t of transactions) {
        const randomBit = faker.number.binary();
        const randomType =
          randomBit === "1" ? transactionType.expense : transactionType.income;
        const update = {
          ...t,
          type: randomType,
        };
        const result = yield* updateTransaction(t, update);
        expect(result.type).toBe(randomType);
      }
    }),
  );

  effectIt.effect("should update the description of a transaction", () =>
    Effect.gen(function* () {
      const transactions = mockExpenseTransactions();
      for (const t of transactions) {
        const randomString = faker.lorem.words(
          faker.number.int({ min: 1, max: 10 }),
        );
        const update = {
          ...t,
          description: randomString,
        };
        const result = yield* updateTransaction(t, update);
        expect(result.description).toBe(randomString);
      }
    }),
  );
});
