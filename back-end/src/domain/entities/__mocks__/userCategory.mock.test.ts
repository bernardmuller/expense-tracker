import { describe, expect, it } from "vitest";
import {
  generateMockUserCategory,
  mockUserCategories,
} from "./userCategory.mock";

describe("generateMockUserCategory", () => {
  it("should generate a userCategory with all required properties", () => {
    const result = generateMockUserCategory();

    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("userId");
    expect(result).toHaveProperty("categoryId");
  });

  it("should apply overwrites to generated userCategory", () => {
    const customUserId = "custom-user-id";
    const customCategoryId = "custom-category-id";
    const result = generateMockUserCategory({
      userId: customUserId,
      categoryId: customCategoryId,
    });

    expect(result.userId).toBe(customUserId);
    expect(result.categoryId).toBe(customCategoryId);
  });
});

describe("mockUserCategories", () => {
  it("should generate default of 10 userCategories when no count is provided", () => {
    const result = mockUserCategories();

    expect(result).toHaveLength(10);
  });

  it("should generate the specified number of userCategories", () => {
    expect(mockUserCategories(1)).toHaveLength(1);
    expect(mockUserCategories(5)).toHaveLength(5);
    expect(mockUserCategories(20)).toHaveLength(20);
  });

  it("should generate userCategories with all required properties", () => {
    const results = mockUserCategories(3);

    results.forEach((result) => {
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("userId");
      expect(result).toHaveProperty("categoryId");
    });
  });
});
