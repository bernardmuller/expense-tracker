import { describe, it, expect } from "vitest";
import {
  generateMockCategory,
  mockCategories,
  mockDeletedCategories,
} from "./category.mock";

describe("generateMockCategory", () => {
  it("should generate a category with all required properties", () => {
    const result = generateMockCategory();

    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("key");
    expect(result).toHaveProperty("label");
    expect(result).toHaveProperty("icon");
    expect(result).toHaveProperty("deletedAt");
    expect(result).toHaveProperty("updatedAt");
  });

  it("should apply overwrites to generated category", () => {
    const customKey = "custom-key";
    const customLabel = "Custom Label";
    const result = generateMockCategory({
      key: customKey,
      label: customLabel,
    });

    expect(result.key).toBe(customKey);
    expect(result.label).toBe(customLabel);
  });
});

describe("mockCategories", () => {
  it("should generate default of 10 categories when no count is provided", () => {
    const result = mockCategories();

    expect(result).toHaveLength(10);
  });

  it("should generate the specified number of categories", () => {
    expect(mockCategories(1)).toHaveLength(1);
    expect(mockCategories(5)).toHaveLength(5);
    expect(mockCategories(20)).toHaveLength(20);
  });

  it("should generate categories with all required properties", () => {
    const results = mockCategories(3);

    results.forEach((result) => {
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("key");
      expect(result).toHaveProperty("label");
      expect(result).toHaveProperty("icon");
      expect(result).toHaveProperty("deletedAt");
      expect(result).toHaveProperty("updatedAt");
    });
  });
});

describe("mockDeletedCategories", () => {
  it("should generate default of 10 deleted categories when no count is provided", () => {
    const result = mockDeletedCategories();

    expect(result).toHaveLength(10);
  });

  it("should generate the specified number of deleted categories", () => {
    expect(mockDeletedCategories(2)).toHaveLength(2);
    expect(mockDeletedCategories(8)).toHaveLength(8);
    expect(mockDeletedCategories(13)).toHaveLength(13);
  });

  it("should generate deleted categories with all required properties", () => {
    const results = mockDeletedCategories(3);

    results.forEach((result) => {
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("key");
      expect(result).toHaveProperty("label");
      expect(result).toHaveProperty("icon");
      expect(result.deletedAt).toBeTruthy();
      expect(result).toHaveProperty("updatedAt");
    });
  });

  it("should generate categories that are marked as deleted", () => {
    const results = mockDeletedCategories(5);

    results.forEach((result) => {
      expect(result.deletedAt).not.toBeUndefined();
      expect(result.deletedAt).not.toBeNull();
    });
  });
});
