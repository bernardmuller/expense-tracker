import { describe, expect, beforeEach } from "vitest";
import { it as effectIt } from "@effect/vitest";
import { Effect, Exit } from "effect";
import { AlreadyDeletedError } from "@/lib/errors";
import { createBudget, type CreateBudgetParams } from "./budget";
import { transactionType } from "./types/TransactionType";
import { faker } from "@faker-js/faker";
import { generateUuid } from "@/lib/utils/generateUuid";
import {
  mockBudgets
} from "./__mocks__/budget.mock.js";


describe("createBudget", () => {
  let mock: CreateBudgetParams;

  beforeEach(() => {
    mock = {
      name: faker.animal.cow(),
      startAmount: 10000,
      userId: faker.string.uuid()
    };
  });

  effectIt.effect("should create a budget with the provided properties", () =>
    Effect.gen(function*() {
      const result = yield* Effect.exit(createBudget(mock));
      expect(Exit.isSuccess(result)).toBe(true);
      if (Exit.isSuccess(result)) {
        expect(result.value.name).toBe(mock.name);
        expect(result.value.startAmount).toBe(mock.startAmount);
        expect(result.value.userId).toBe(mock.userId);
      }
    })
  );

})


