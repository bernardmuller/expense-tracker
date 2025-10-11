import { calculatePercentage } from "@/lib/utils/calculatePercentage";
import { getNumberOfDecimalPlaces } from "@/lib/utils/getNumberOfDecimalPlaces";
import { faker } from "@faker-js/faker";
import { beforeEach, describe, expect, it } from "vitest";
import { generateMockBudget, mockBudgets } from "../__mocks__/budget.mock";
import {
  BudgetAlreadyActiveError,
  BudgetAlreadyInActiveError,
  InvalidStartAmountError,
  MissingRequiredFieldsError,
} from "./budgetErrors";
import {
  addToBudgetCurrentAmount,
  createBudget,
  getBudgetSpentAmount,
  getBudgetSpentPercentage,
  isBudgetActive,
  isBudgetOverbudget,
  setBudgetActive,
  setBudgetInactive,
  subtractFromBudgetCurrentAmount,
  updateBudgetName,
  type Budget,
  type CreateBudgetParams,
} from "./index";

describe("createBudget", () => {
  let mock: CreateBudgetParams;

  beforeEach(() => {
    mock = {
      name: faker.animal.cow(),
      startAmount: 10000,
      userId: faker.string.uuid(),
    };
  });

  it("should create a budget with the provided properties", () => {
    const result = createBudget(mock);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.name).toBe(mock.name);
      expect(result.value.startAmount).toBe(mock.startAmount);
      expect(result.value.userId).toBe(mock.userId);
    }
  });

  it("should error with a list of fields if the create properties are not provided", () => {
    //@ts-expect-error
    const result = createBudget({});
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(MissingRequiredFieldsError);
      expect(result.error).toMatchObject({
        fields: ["userId", "name", "startAmount"],
      });
    }
  });

  it("should error with InvalidStartAmountError if the start amount is negative", () => {
    const result = createBudget({
      ...mock,
      startAmount: -100,
    });
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(InvalidStartAmountError);
      expect(result.error).toMatchObject({
        amount: -100,
      });
    }
  });

  it("should create a complete budget entity", () => {
    const result = createBudget(mock);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toHaveProperty("isActive");
      expect(result.value).toHaveProperty("id");
      expect(result.value).toHaveProperty("currentAmount");
    }
  });

  it("should set the currentAmount to the start amount", () => {
    const result = createBudget(mock);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.currentAmount).toBe(mock.startAmount);
    }
  });
});

describe("getBudgetSpentAmount", () => {
  let mock: Budget;

  beforeEach(() => {
    mock = generateMockBudget();
  });

  it("should calculate the total spent amount", () => {
    const result = getBudgetSpentAmount(mock);
    const expected = mock.startAmount - mock.currentAmount;
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toBe(expected);
    }
  });

  it("should throw if budget has no start or currentAmount", () => {
    const result = getBudgetSpentAmount({
      ...mock,
      //@ts-expect-error: testing undefined edge-cases
      currentAmount: undefined,
      //@ts-expect-error: testing undefined edge-cases
      startAmount: undefined,
    });
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(MissingRequiredFieldsError);
      expect(result.error).toMatchObject({
        fields: ["startAmount", "currentAmount"],
      });
    }
  });

  it("should handle currentAmount going into the negatives", () => {
    const result = getBudgetSpentAmount({
      ...mock,
      currentAmount: -200,
      startAmount: 1000,
    });
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toBe(1200);
    }
  });
});

describe("getBudgetSpentPercentage", () => {
  let mock: Budget;

  beforeEach(() => {
    mock = generateMockBudget();
  });

  it("should calculate the total spent percentage", () => {
    const result = getBudgetSpentPercentage(mock);
    const difference = mock.startAmount - mock.currentAmount;
    const expected = calculatePercentage(difference, mock.startAmount);

    expect(result.isOk()).toBe(true);
    expect(expected.isOk()).toBe(true);
    if (result.isOk() && expected.isOk()) {
      expect(result.value).toBe(expected.value);
    }
  });

  it("should throw if budget has no start or currentAmount", () => {
    const result = getBudgetSpentPercentage({
      ...mock,
      //@ts-expect-error: testing undefined edge-cases
      currentAmount: undefined,
      //@ts-expect-error: testing undefined edge-cases
      startAmount: undefined,
    });
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(MissingRequiredFieldsError);
      expect(result.error).toMatchObject({
        fields: ["startAmount", "currentAmount"],
      });
    }
  });

  it("should calculate up to 1 decimals", () => {
    const budgets = mockBudgets();
    for (const mock of budgets) {
      const result = getBudgetSpentPercentage(mock);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        const decimalPlaces = getNumberOfDecimalPlaces(result.value);
        expect(decimalPlaces.isOk()).toBe(true);
        if (decimalPlaces.isOk()) {
          expect(decimalPlaces.value).toBe(1);
        }
      }
    }
  });
});

describe("setBudgetActive", () => {
  let mock: Budget;

  beforeEach(() => {
    mock = generateMockBudget({
      isActive: false,
    });
  });

  it("should set the budget as active", () => {
    const result = setBudgetActive(mock);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.isActive).toBe(true);
    }
  });

  it("should throw if the budget is already active", () => {
    mock.isActive = true;
    const result = setBudgetActive(mock);
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(BudgetAlreadyActiveError);
      expect(result.error).toMatchObject({
        budgetId: mock.id,
      });
    }
  });
});

describe("setBudgetInactive", () => {
  let mock: Budget;

  beforeEach(() => {
    mock = generateMockBudget({
      isActive: true,
    });
  });

  it("should set the budget as inactive", () => {
    const result = setBudgetInactive(mock);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.isActive).toBe(false);
    }
  });

  it("should throw if the budget is already inactive", () => {
    mock.isActive = false;
    const result = setBudgetInactive(mock);
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(BudgetAlreadyInActiveError);
      expect(result.error).toMatchObject({
        budgetId: mock.id,
      });
    }
  });
});

describe("isBudgetActive", () => {
  let mock: Budget;

  beforeEach(() => {
    mock = generateMockBudget();
  });

  it("should return true if budget is active", () => {
    mock.isActive = true;
    const result = isBudgetActive(mock);
    expect(result).toBe(true);
  });

  it("should return false if budget is not active", () => {
    mock.isActive = false;
    const result = isBudgetActive(mock);
    expect(result).toBe(false);
  });
});

describe("isBudgetOverbudget", () => {
  let mock: Budget;

  beforeEach(() => {
    mock = generateMockBudget();
  });

  it("should return true if current amount is negative", () => {
    mock.currentAmount = -100;
    const result = isBudgetOverbudget(mock);
    expect(result).toBe(true);
  });

  it("should return false if current amount is positive", () => {
    mock.currentAmount = 100;
    const result = isBudgetOverbudget(mock);
    expect(result).toBe(false);
  });

  it("should return false if current amount is zero", () => {
    mock.currentAmount = 0;
    const result = isBudgetOverbudget(mock);
    expect(result).toBe(false);
  });
});

describe("updateBudgetName", () => {
  let mock: Budget;

  beforeEach(() => {
    mock = generateMockBudget();
  });

  it("should update the name of the budget", () => {
    const newName = faker.animal.cow();
    const result = updateBudgetName(mock, newName);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.name).toBe(newName);
    }
  });
});

describe("addToBudgetCurrentAmount", () => {
  let mock: Budget;

  beforeEach(() => {
    mock = generateMockBudget({
      currentAmount: 1000,
    });
  });

  it("should add to the current amount", () => {
    const amountToAdd = 500;
    const result = addToBudgetCurrentAmount(mock, amountToAdd);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.currentAmount).toBe(1500);
    }
  });
});

describe("subtractFromBudgetCurrentAmount", () => {
  let mock: Budget;

  beforeEach(() => {
    mock = generateMockBudget({
      currentAmount: 1000,
    });
  });

  it("should subtract from the current amount", () => {
    const amountToSubtract = 300;
    const result = subtractFromBudgetCurrentAmount(mock, amountToSubtract);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.currentAmount).toBe(700);
    }
  });
});

