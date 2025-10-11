import { faker } from "@faker-js/faker";
import { beforeEach, describe, expect, it } from "vitest";
import {
  generateMockCategory,
  mockCategories,
} from "../__mocks__/category.mock";
import {
  InvalidCategoryKeyError,
  InvalidCategoryLabelError,
} from "./categoryErrors";
import {
  createCategory,
  updateCategory,
  type CreateCategoryParams,
} from "./index";

describe("createCategory", () => {
  let mock: CreateCategoryParams;

  beforeEach(() => {
    mock = {
      key: faker.word.noun().toLowerCase(),
      label: faker.word.words(2),
      icon: faker.internet.emoji(),
    };
  });

  it("should create a category with the provided properties", () => {
    const result = createCategory(mock);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.key).toBe(mock.key);
      expect(result.value.label).toBe(mock.label);
      expect(result.value.icon).toBe(mock.icon);
    }
  });

  it("should create a category with an id", () => {
    const result = createCategory(mock);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.id).toBeTruthy();
    }
  });
});

describe("updateCategory", () => {
  it("should update the label of a category", () => {
    const categories = mockCategories(5);
    for (const category of categories) {
      const newLabel = faker.word.words(3);
      const result = updateCategory(category, { label: newLabel });
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.label).toBe(newLabel);
      }
    }
  });

  it("should update the key of a category", () => {
    const categories = mockCategories(5);
    for (const category of categories) {
      const newKey = faker.word.noun().toLowerCase();
      const result = updateCategory(category, { key: newKey });
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.key).toBe(newKey);
      }
    }
  });

  it("should update the icon of a category", () => {
    const categories = mockCategories(5);
    for (const category of categories) {
      const newIcon = faker.internet.emoji();
      const result = updateCategory(category, { icon: newIcon });
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.icon).toBe(newIcon);
      }
    }
  });

  it("should update multiple fields at once", () => {
    const category = generateMockCategory();
    const newLabel = faker.word.words(2);
    const newKey = faker.word.noun().toLowerCase();
    const newIcon = faker.internet.emoji();

    const result = updateCategory(category, {
      label: newLabel,
      key: newKey,
      icon: newIcon,
    });
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.label).toBe(newLabel);
      expect(result.value.key).toBe(newKey);
      expect(result.value.icon).toBe(newIcon);
    }
  });

  it("should not modify fields that are not provided", () => {
    const category = generateMockCategory();
    const originalKey = category.key;
    const originalIcon = category.icon;
    const newLabel = faker.word.words(2);

    const result = updateCategory(category, { label: newLabel });
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.label).toBe(newLabel);
      expect(result.value.key).toBe(originalKey);
      expect(result.value.icon).toBe(originalIcon);
    }
  });

  it("should fail when label is empty", () => {
    const category = generateMockCategory();
    const result = updateCategory(category, { label: "" });
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(InvalidCategoryLabelError);
    }
  });

  it("should fail when label is only whitespace", () => {
    const category = generateMockCategory();
    const result = updateCategory(category, { label: "   " });
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(InvalidCategoryLabelError);
    }
  });

  it("should fail when key is empty", () => {
    const category = generateMockCategory();
    const result = updateCategory(category, { key: "" });
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(InvalidCategoryKeyError);
    }
  });

  it("should fail when key is only whitespace", () => {
    const category = generateMockCategory();
    const result = updateCategory(category, { key: "   " });
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(InvalidCategoryKeyError);
    }
  });
});
