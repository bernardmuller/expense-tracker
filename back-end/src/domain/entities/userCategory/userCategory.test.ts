import { describe, expect, beforeEach, it } from "vitest";
import { MissingRequiredFieldsError } from "./userCategoryErrors";
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

  it("should fail when userId is missing", () => {
    const invalidMock = { ...mock, userId: "" };
    const result = createUserCategory(invalidMock);
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(MissingRequiredFieldsError);
    }
  });

  it("should fail when categoryId is missing", () => {
    const invalidMock = { ...mock, categoryId: "" };
    const result = createUserCategory(invalidMock);
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(MissingRequiredFieldsError);
    }
  });
});
