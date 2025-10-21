import { describe, expect, beforeEach, it } from "vitest";
import { createUserCategory, type CreateUserCategoryParams } from "./index";
import { faker } from "@faker-js/faker";

describe("createUserCategory", () => {
  let mock: CreateUserCategoryParams;

  beforeEach(() => {
    mock = {
      userId: faker.string.uuid(),
      categoryId: faker.string.uuid(),
    };
  });

  it("should create a userCategory with the provided properties", () => {
    const result = createUserCategory(mock);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.userId).toBe(mock.userId);
      expect(result.value.categoryId).toBe(mock.categoryId);
    }
  });

  it("should create a userCategory with an id", () => {
    const result = createUserCategory(mock);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.id).toBeTruthy();
    }
  });
});
