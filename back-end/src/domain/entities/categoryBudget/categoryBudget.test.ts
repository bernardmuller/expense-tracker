import { faker } from "@faker-js/faker";
import { beforeEach, describe, expect, it } from "vitest";
import {
  generateMockCategoryBudget,
  mockCategoryBudgets,
} from "../__mocks__/categoryBudget.mock";
import { InvalidAllocatedAmountError } from "./categoryBudgetErrors";
import {
  createCategoryBudget,
  updateAllocatedAmount,
  type CreateCategoryBudgetParams,
} from "./index";

describe("createCategoryBudget", () => {
  let mock: CreateCategoryBudgetParams;

  beforeEach(() => {
    mock = {
      budgetId: faker.string.uuid(),
      categoryId: faker.string.uuid(),
      allocatedAmount: faker.number.float({ min: 0, max: 10000 }),
    };
  });

  it("should create a categoryBudget with the provided properties", () => {
    const result = createCategoryBudget(mock);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.budgetId).toBe(mock.budgetId);
      expect(result.value.categoryId).toBe(mock.categoryId);
      expect(result.value.allocatedAmount).toBe(mock.allocatedAmount);
    }
  });

  it("should create a categoryBudget with an id", () => {
    const result = createCategoryBudget(mock);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.id).toBeTruthy();
    }
  });

  it("should fail when allocatedAmount is negative", () => {
    const invalidMock = { ...mock, allocatedAmount: -100 };
    const result = createCategoryBudget(invalidMock);
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(InvalidAllocatedAmountError);
    }
  });
});

describe("updateAllocatedAmount", () => {
  it("should update the allocated amount", () => {
    const categoryBudgets = mockCategoryBudgets(5);
    for (const categoryBudget of categoryBudgets) {
      const newAmount = faker.number.float({ min: 0, max: 10000 });
      const result = updateAllocatedAmount(categoryBudget, newAmount);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.allocatedAmount).toBe(newAmount);
      }
    }
  });

  it("should fail when amount is negative", () => {
    const categoryBudget = generateMockCategoryBudget();
    const result = updateAllocatedAmount(categoryBudget, -100);
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(InvalidAllocatedAmountError);
    }
  });
});
