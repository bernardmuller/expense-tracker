import { describe, it, expect } from "vitest";
import {
  generateMockCategoryBudget,
  mockCategoryBudgets,
  mockDeletedCategoryBudgets,
} from "./categoryBudget.mock";

describe("generateMockCategoryBudget", () => {
  it("should generate a categoryBudget with all required properties", () => {
    const result = generateMockCategoryBudget();

    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("budgetId");
    expect(result).toHaveProperty("categoryId");
    expect(result).toHaveProperty("allocatedAmount");
    expect(result).toHaveProperty("deletedAt");
    expect(result).toHaveProperty("updatedAt");
  });

  it("should apply overwrites to generated categoryBudget", () => {
    const customBudgetId = "custom-budget-id";
    const customAmount = 5000;
    const result = generateMockCategoryBudget({
      budgetId: customBudgetId,
      allocatedAmount: customAmount,
    });

    expect(result.budgetId).toBe(customBudgetId);
    expect(result.allocatedAmount).toBe(customAmount);
  });
});

describe("mockCategoryBudgets", () => {
  it("should generate default of 10 categoryBudgets when no count is provided", () => {
    const result = mockCategoryBudgets();

    expect(result).toHaveLength(10);
  });

  it("should generate the specified number of categoryBudgets", () => {
    expect(mockCategoryBudgets(1)).toHaveLength(1);
    expect(mockCategoryBudgets(5)).toHaveLength(5);
    expect(mockCategoryBudgets(20)).toHaveLength(20);
  });

  it("should generate categoryBudgets with all required properties", () => {
    const results = mockCategoryBudgets(3);

    results.forEach((result) => {
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("budgetId");
      expect(result).toHaveProperty("categoryId");
      expect(result).toHaveProperty("allocatedAmount");
      expect(result).toHaveProperty("deletedAt");
      expect(result).toHaveProperty("updatedAt");
    });
  });
});

describe("mockDeletedCategoryBudgets", () => {
  it("should generate default of 10 deleted categoryBudgets when no count is provided", () => {
    const result = mockDeletedCategoryBudgets();

    expect(result).toHaveLength(10);
  });

  it("should generate the specified number of deleted categoryBudgets", () => {
    expect(mockDeletedCategoryBudgets(2)).toHaveLength(2);
    expect(mockDeletedCategoryBudgets(8)).toHaveLength(8);
    expect(mockDeletedCategoryBudgets(13)).toHaveLength(13);
  });

  it("should generate deleted categoryBudgets with all required properties", () => {
    const results = mockDeletedCategoryBudgets(3);

    results.forEach((result) => {
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("budgetId");
      expect(result).toHaveProperty("categoryId");
      expect(result).toHaveProperty("allocatedAmount");
      expect(result.deletedAt).toBeTruthy();
      expect(result).toHaveProperty("updatedAt");
    });
  });

  it("should generate categoryBudgets that are marked as deleted", () => {
    const results = mockDeletedCategoryBudgets(5);

    results.forEach((result) => {
      expect(result.deletedAt).not.toBeUndefined();
      expect(result.deletedAt).not.toBeNull();
    });
  });
});
