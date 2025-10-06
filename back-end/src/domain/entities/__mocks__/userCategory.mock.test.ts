import { describe, it, expect } from "vitest";
import {
  generateMockUserCategory,
  mockUserCategories,
  mockDeletedUserCategories,
} from "./userCategory.mock";

describe("generateMockUserCategory", () => {
  it("should generate a userCategory with all required properties", () => {
    const result = generateMockUserCategory();

    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("userId");
    expect(result).toHaveProperty("categoryId");
    expect(result).toHaveProperty("deletedAt");
    expect(result).toHaveProperty("updatedAt");
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
      expect(result).toHaveProperty("deletedAt");
      expect(result).toHaveProperty("updatedAt");
    });
  });
});

describe("mockDeletedUserCategories", () => {
  it("should generate default of 10 deleted userCategories when no count is provided", () => {
    const result = mockDeletedUserCategories();

    expect(result).toHaveLength(10);
  });

  it("should generate the specified number of deleted userCategories", () => {
    expect(mockDeletedUserCategories(2)).toHaveLength(2);
    expect(mockDeletedUserCategories(8)).toHaveLength(8);
    expect(mockDeletedUserCategories(13)).toHaveLength(13);
  });

  it("should generate deleted userCategories with all required properties", () => {
    const results = mockDeletedUserCategories(3);

    results.forEach((result) => {
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("userId");
      expect(result).toHaveProperty("categoryId");
      expect(result.deletedAt).toBeTruthy();
      expect(result).toHaveProperty("updatedAt");
    });
  });

  it("should generate userCategories that are marked as deleted", () => {
    const results = mockDeletedUserCategories(5);

    results.forEach((result) => {
      expect(result.deletedAt).not.toBeUndefined();
      expect(result.deletedAt).not.toBeNull();
    });
  });
});
