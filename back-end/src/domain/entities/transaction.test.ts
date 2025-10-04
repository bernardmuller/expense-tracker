import { describe, expect, beforeEach } from "vitest";
import { it as effectIt } from "@effect/vitest";
import { Effect, Exit } from "effect";
import { AlreadyDeletedError } from "@/lib/errors/index.js";
import {
  createTransaction,
  softDeleteTransaction,
  updateTransaction,
  type CreateTransactionParams,
  type Transaction
} from "./transaction.js";
import { transactionType } from "./types/TransactionType.js";
import { faker } from "@faker-js/faker";
import { generateUuid } from "@/lib/utils/generateUuid";
import {
  mockExpenseTransactions
} from "./__mocks__/transaction.mock.js";

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
    Effect.gen(function*() {
      const result = yield* Effect.exit(createTransaction(mock));
      expect(Exit.isSuccess(result)).toBe(true);
      if (Exit.isSuccess(result)) {
        expect(result.value.type).toBe(mock.type);
      }
    })
  );

  effectIt.effect("should create an expense with the provided properties", () =>
    Effect.gen(function*() {
      const result = yield* Effect.exit(createTransaction(mock));
      expect(Exit.isSuccess(result)).toBe(true);
      if (Exit.isSuccess(result)) {
        expect(result.value.type).toBe(mock.type);
        expect(result.value.description).toBe(mock.description);
        expect(result.value.amount).toBe(mock.amount);
        expect(result.value.budgetId).toBe(mock.budgetId);
        expect(result.value.categoryId).toBe(mock.categoryId);
      }
    })
  );

  effectIt.effect("should create an expense with that has no deletedAt property", () =>
    Effect.gen(function*() {
      const result = yield* Effect.exit(createTransaction(mock));
      expect(Exit.isSuccess(result)).toBe(true);
      if (Exit.isSuccess(result)) {
        expect(result.value.deletedAt).toBeFalsy();
      }
    })
  );

  effectIt.effect("should create an expense with that has no deletedAt property", () =>
    Effect.gen(function*() {
      const result = yield* Effect.exit(createTransaction(mock));
      expect(Exit.isSuccess(result)).toBe(true);
      if (Exit.isSuccess(result)) {
        expect(result.value.deletedAt).toBeFalsy();
      }
    })
  );

  effectIt.effect("should create an expense with that has no deletedAt property", () =>
    Effect.gen(function*() {
      const result = yield* Effect.exit(createTransaction(mock));
      expect(Exit.isSuccess(result)).toBe(true);
      if (Exit.isSuccess(result)) {
        expect(result.value.id).toBeTruthy();
      }
    })
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

  effectIt.effect("should timestamp the updatedAt property of the transaction", () =>
    Effect.gen(function*() {
      const transactions = mockExpenseTransactions()
      for (const t of transactions) {
        const result = yield* Effect.exit(updateTransaction(t, t));
        expect(Exit.isSuccess(result)).toBe(true);
        if (Exit.isSuccess(result)) {
          expect(result.value.updatedAt).toBeTruthy();
        }
      }
    })
  );

  effectIt.effect("should update the amount of a transaction", () =>
    Effect.gen(function*() {
      const transactions = mockExpenseTransactions()
      for (const t of transactions) {
        const randomAmount = faker.number.float({ max: 10000, fractionDigits: 1 })
        const update = {
          ...t,
          amount: randomAmount
        };
        const result = yield* Effect.exit(updateTransaction(t, update));
        expect(Exit.isSuccess(result)).toBe(true);
        if (Exit.isSuccess(result)) {
          expect(result.value.amount).toBe(randomAmount);
        }
      }
    })
  );

  effectIt.effect("should error when trying to update the budget or category", () =>
    Effect.gen(function*() {
      const update = {
        ...mock,
        budgetId: faker.string.uuid(),
        categoryId: faker.string.uuid(),
      };
      const result = yield* Effect.exit(updateTransaction(mock, update));
      expect(Exit.isFailure(result)).toBe(true);
    })
  );

  effectIt.effect("should error when trying to update the transaction ID", () =>
    Effect.gen(function*() {
      const update = {
        ...mock,
        id: faker.string.uuid()
      };
      const result = yield* Effect.exit(updateTransaction(mock, update));
      expect(Exit.isFailure(result)).toBe(true);
    })
  );

  effectIt.effect("should error when trying to update the transaction ID", () =>
    Effect.gen(function*() {
      const update = {
        ...mock,
        id: faker.string.uuid()
      };
      const result = yield* Effect.exit(updateTransaction(mock, update));
      expect(Exit.isFailure(result)).toBe(true);
    })
  );

  effectIt.effect("should update the type of a transaction", () =>
    Effect.gen(function*() {
      const transactions = mockExpenseTransactions()
      for (const t of transactions) {
        const randomBit = faker.number.binary();
        const randomType = randomBit === "1" ? transactionType.expense : transactionType.income
        const update = {
          ...t,
          type: randomType
        };
        const result = yield* Effect.exit(updateTransaction(t, update));
        expect(Exit.isSuccess(result)).toBe(true);
        if (Exit.isSuccess(result)) {
          expect(result.value.type).toBe(randomType);
        }
      }
    })
  );

  effectIt.effect("should update the description of a transaction", () =>
    Effect.gen(function*() {
      const transactions = mockExpenseTransactions()
      for (const t of transactions) {
        const randomString = faker.lorem.words(faker.number.int({ min: 1, max: 10 }));
        const update = {
          ...t,
          description: randomString
        };
        const result = yield* Effect.exit(updateTransaction(t, update));
        expect(Exit.isSuccess(result)).toBe(true);
        if (Exit.isSuccess(result)) {
          expect(result.value.description).toBe(randomString);
        }
      }
    })
  );
})


describe("softDeleteTransaction", () => {
  effectIt.effect("should be marked as deleted", () =>
    Effect.gen(function*() {
      const transactions = mockExpenseTransactions()
      for (const t of transactions) {
        t.deletedAt = undefined;
        const result = yield* Effect.exit(softDeleteTransaction(t));
        expect(Exit.isSuccess(result)).toBe(true);
        if (Exit.isSuccess(result)) {
          expect(result.value.deletedAt).toBeTruthy();
        }
      }
    })
  );

  effectIt.effect("should not be able to soft delete as user that is already deleted", () =>
    Effect.gen(function*() {
      const transactions = mockExpenseTransactions()
      for (const t of transactions) {
        t.deletedAt = faker.date.anytime().toLocaleString();
        const result = yield* Effect.exit(softDeleteTransaction(t));
        expect(Exit.isFailure(result)).toBeTruthy()
        expect(result).toStrictEqual(Exit.fail(new AlreadyDeletedError()));
      }
    })
  );
});
