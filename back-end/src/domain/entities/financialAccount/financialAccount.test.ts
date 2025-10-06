import { describe, expect, beforeEach } from "vitest";
import { it as effectIt } from "@effect/vitest";
import { Effect, Exit } from "effect";
import {
  MissingRequiredFieldsError,
  FinancialAccountAlreadySoftDeletedError,
  InvalidFinancialAccountNameError,
  InvalidCurrentAmountError,
  FinancialAccountTypeAlreadySetError,
  InvalidSubtractionAmountError,
  InvalidAdditionAmountError,
} from "./financialAccountErrors";
import {
  createFinancialAccount,
  updateFinancialAccount,
  changeFinancialAccountType,
  addToCurrentAmount,
  subtractFromCurrentAmount,
  softDeleteFinancialAccount,
  isFinancialAccountSoftDeleted,
  type FinancialAccount,
  type CreateFinancialAccountParams,
} from "./index";
import { faker } from "@faker-js/faker";
import {
  generateMockFinancialAccount,
  mockFinancialAccounts,
} from "../__mocks__/financialAccount.mock";
import { financialAccountType } from "../enums/financialAccountType";

describe("createFinancialAccount", () => {
  let mock: CreateFinancialAccountParams;

  beforeEach(() => {
    mock = {
      type: "bank",
      name: faker.finance.accountName(),
      description: faker.lorem.sentence(),
      currentAmount: faker.number.float({ min: 0, max: 10000 }),
    };
  });

  effectIt.effect(
    "should create a financialAccount with the provided properties",
    () =>
      Effect.gen(function* () {
        const result = yield* createFinancialAccount(mock);
        expect(result.type).toBe(mock.type);
        expect(result.name).toBe(mock.name);
        expect(result.description).toBe(mock.description);
        expect(result.currentAmount).toBe(mock.currentAmount);
      }),
  );

  effectIt.effect("should create a financialAccount with an id", () =>
    Effect.gen(function* () {
      const result = yield* createFinancialAccount(mock);
      expect(result.id).toBeTruthy();
    }),
  );

  effectIt.effect(
    "should create a financialAccount with no deletedAt property",
    () =>
      Effect.gen(function* () {
        const result = yield* createFinancialAccount(mock);
        expect(result.deletedAt).toBeFalsy();
      }),
  );

  effectIt.effect("should fail when type is missing", () =>
    Effect.gen(function* () {
      const invalidMock = { ...mock, type: "" as any };
      const result = yield* Effect.exit(createFinancialAccount(invalidMock));
      expect(Exit.isFailure(result)).toBe(true);
      if (Exit.isFailure(result)) {
        expect(result.cause._tag).toBe("Fail");
        if (result.cause._tag === "Fail") {
          expect(result.cause.error).toBeInstanceOf(MissingRequiredFieldsError);
        }
      }
    }),
  );

  effectIt.effect("should fail when name is missing", () =>
    Effect.gen(function* () {
      const invalidMock = { ...mock, name: "" };
      const result = yield* Effect.exit(createFinancialAccount(invalidMock));
      expect(Exit.isFailure(result)).toBe(true);
      if (Exit.isFailure(result)) {
        expect(result.cause._tag).toBe("Fail");
        if (result.cause._tag === "Fail") {
          expect(result.cause.error).toBeInstanceOf(MissingRequiredFieldsError);
        }
      }
    }),
  );

  effectIt.effect("should fail when currentAmount is negative", () =>
    Effect.gen(function* () {
      const invalidMock = { ...mock, currentAmount: -100 };
      const result = yield* Effect.exit(createFinancialAccount(invalidMock));
      expect(Exit.isFailure(result)).toBe(true);
      if (Exit.isFailure(result)) {
        expect(result.cause._tag).toBe("Fail");
        if (result.cause._tag === "Fail") {
          expect(result.cause.error).toBeInstanceOf(InvalidCurrentAmountError);
        }
      }
    }),
  );
});

describe("updateFinancialAccount", () => {
  effectIt.effect("should update the name of a financialAccount", () =>
    Effect.gen(function* () {
      const financialAccounts = mockFinancialAccounts(5);
      for (const account of financialAccounts) {
        const newName = faker.finance.accountName();
        const result = yield* updateFinancialAccount(account, {
          name: newName,
        });
        expect(result.name).toBe(newName);
      }
    }),
  );

  effectIt.effect("should update the description of a financialAccount", () =>
    Effect.gen(function* () {
      const financialAccounts = mockFinancialAccounts(5);
      for (const account of financialAccounts) {
        const newDescription = faker.lorem.sentence();
        const result = yield* updateFinancialAccount(account, {
          description: newDescription,
        });
        expect(result.description).toBe(newDescription);
      }
    }),
  );

  effectIt.effect("should update multiple fields at once", () =>
    Effect.gen(function* () {
      const account = generateMockFinancialAccount();
      const newName = faker.finance.accountName();
      const newDescription = faker.lorem.sentence();

      const result = yield* updateFinancialAccount(account, {
        name: newName,
        description: newDescription,
      });
      expect(result.name).toBe(newName);
      expect(result.description).toBe(newDescription);
    }),
  );

  effectIt.effect("should timestamp the updatedAt property", () =>
    Effect.gen(function* () {
      const account = generateMockFinancialAccount();
      const newName = faker.finance.accountName();
      const result = yield* updateFinancialAccount(account, { name: newName });
      expect(result.updatedAt).toBeTruthy();
    }),
  );

  effectIt.effect("should not modify fields that are not provided", () =>
    Effect.gen(function* () {
      const account = generateMockFinancialAccount();
      const originalDescription = account.description;
      const newName = faker.finance.accountName();

      const result = yield* updateFinancialAccount(account, { name: newName });
      expect(result.name).toBe(newName);
      expect(result.description).toBe(originalDescription);
    }),
  );

  effectIt.effect("should fail when name is empty", () =>
    Effect.gen(function* () {
      const account = generateMockFinancialAccount();
      const result = yield* Effect.exit(
        updateFinancialAccount(account, { name: "" }),
      );
      expect(Exit.isFailure(result)).toBe(true);
      if (Exit.isFailure(result)) {
        expect(result.cause._tag).toBe("Fail");
        if (result.cause._tag === "Fail") {
          expect(result.cause.error).toBeInstanceOf(
            InvalidFinancialAccountNameError,
          );
        }
      }
    }),
  );

  effectIt.effect("should fail when name is only whitespace", () =>
    Effect.gen(function* () {
      const account = generateMockFinancialAccount();
      const result = yield* Effect.exit(
        updateFinancialAccount(account, { name: "   " }),
      );
      expect(Exit.isFailure(result)).toBe(true);
      if (Exit.isFailure(result)) {
        expect(result.cause._tag).toBe("Fail");
        if (result.cause._tag === "Fail") {
          expect(result.cause.error).toBeInstanceOf(
            InvalidFinancialAccountNameError,
          );
        }
      }
    }),
  );
});

describe("changeFinancialAccountType", () => {
  effectIt.effect("should change the type of a financialAccount", () =>
    Effect.gen(function* () {
      const account = generateMockFinancialAccount({
        type: financialAccountType.crypto,
      });
      const result = yield* changeFinancialAccountType(
        account,
        financialAccountType.bank,
      );
      expect(result.type).toBe(financialAccountType.bank);
    }),
  );

  effectIt.effect("should timestamp the updatedAt property", () =>
    Effect.gen(function* () {
      const account = generateMockFinancialAccount({
        type: financialAccountType.crypto,
      });
      const result = yield* changeFinancialAccountType(
        account,
        financialAccountType.bank,
      );
      expect(result.updatedAt).toBeTruthy();
    }),
  );

  effectIt.effect(
    "should error if the type is already of the provided type",
    () =>
      Effect.gen(function* () {
        const account = generateMockFinancialAccount({
          type: financialAccountType.crypto,
        });
        const result = yield* Effect.exit(
          changeFinancialAccountType(account, financialAccountType.crypto),
        );
        expect(Exit.isFailure(result)).toBe(true);
        if (Exit.isFailure(result)) {
          expect(result.cause._tag).toBe("Fail");
          if (result.cause._tag === "Fail") {
            expect(result.cause.error).toBeInstanceOf(
              FinancialAccountTypeAlreadySetError,
            );
          }
        }
      }),
  );
});

describe("addToCurrentAmount", () => {
  effectIt.effect("should add to the current amount", () =>
    Effect.gen(function* () {
      const account = generateMockFinancialAccount({ currentAmount: 1000 });
      const result = yield* addToCurrentAmount(account, 500);
      expect(result.currentAmount).toBe(1500);
    }),
  );

  effectIt.effect("should timestamp the updatedAt property", () =>
    Effect.gen(function* () {
      const account = generateMockFinancialAccount();
      const result = yield* addToCurrentAmount(account, 100);
      expect(result.updatedAt).toBeTruthy();
    }),
  );

  effectIt.effect("should fail when amount is negative", () =>
    Effect.gen(function* () {
      const account = generateMockFinancialAccount();
      const result = yield* Effect.exit(addToCurrentAmount(account, -100));
      expect(Exit.isFailure(result)).toBe(true);
      if (Exit.isFailure(result)) {
        expect(result.cause._tag).toBe("Fail");
        if (result.cause._tag === "Fail") {
          expect(result.cause.error).toBeInstanceOf(InvalidAdditionAmountError);
        }
      }
    }),
  );
});

describe("subtractFromCurrentAmount", () => {
  effectIt.effect("should subtract from the current amount", () =>
    Effect.gen(function* () {
      const account = generateMockFinancialAccount({ currentAmount: 1000 });
      const result = yield* subtractFromCurrentAmount(account, 300);
      expect(result.currentAmount).toBe(700);
    }),
  );

  effectIt.effect("should allow currentAmount to go negative", () =>
    Effect.gen(function* () {
      const account = generateMockFinancialAccount({ currentAmount: 100 });
      const result = yield* subtractFromCurrentAmount(account, 200);
      expect(result.currentAmount).toBe(-100);
    }),
  );

  effectIt.effect("should timestamp the updatedAt property", () =>
    Effect.gen(function* () {
      const account = generateMockFinancialAccount();
      const result = yield* subtractFromCurrentAmount(account, 50);
      expect(result.updatedAt).toBeTruthy();
    }),
  );

  effectIt.effect("should fail when amount is negative", () =>
    Effect.gen(function* () {
      const account = generateMockFinancialAccount();
      const result = yield* Effect.exit(
        subtractFromCurrentAmount(account, -100),
      );
      expect(Exit.isFailure(result)).toBe(true);
      if (Exit.isFailure(result)) {
        expect(result.cause._tag).toBe("Fail");
        if (result.cause._tag === "Fail") {
          expect(result.cause.error).toBeInstanceOf(
            InvalidSubtractionAmountError,
          );
        }
      }
    }),
  );
});

describe("softDeleteFinancialAccount", () => {
  effectIt.effect("should be marked as deleted", () =>
    Effect.gen(function* () {
      const financialAccounts = mockFinancialAccounts(5);
      for (const account of financialAccounts) {
        account.deletedAt = undefined;
        const result = yield* softDeleteFinancialAccount(account);
        expect(result.deletedAt).toBeTruthy();
      }
    }),
  );

  effectIt.effect(
    "should not be able to soft delete a financialAccount that is already deleted",
    () =>
      Effect.gen(function* () {
        const account = generateMockFinancialAccount();
        account.deletedAt = faker.date.anytime().toISOString();
        const result = yield* Effect.exit(softDeleteFinancialAccount(account));
        expect(Exit.isFailure(result)).toBeTruthy();
        if (Exit.isFailure(result)) {
          expect(result.cause._tag).toBe("Fail");
          if (result.cause._tag === "Fail") {
            expect(result.cause.error).toBeInstanceOf(
              FinancialAccountAlreadySoftDeletedError,
            );
          }
        }
      }),
  );
});

describe("isFinancialAccountSoftDeleted", () => {
  effectIt.effect("should return true when financialAccount is deleted", () =>
    Effect.gen(function* () {
      const account = generateMockFinancialAccount({
        deletedAt: faker.date.anytime().toISOString(),
      });
      const result = isFinancialAccountSoftDeleted(account);
      expect(result).toBe(true);
    }),
  );

  effectIt.effect(
    "should return false when financialAccount is not deleted",
    () =>
      Effect.gen(function* () {
        const account = generateMockFinancialAccount({
          deletedAt: undefined,
        });
        const result = isFinancialAccountSoftDeleted(account);
        expect(result).toBe(false);
      }),
  );
});
