import { describe, expect, it } from "vitest";
import { generateMockCategory, mockCategories } from "./category.mock";

describe("generateMockCategory", () => {
  it("should generate a category with all required properties", () => {
    const result = generateMockCategory();

    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("key");
    expect(result).toHaveProperty("label");
    expect(result).toHaveProperty("icon");
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
    });
  });
});
