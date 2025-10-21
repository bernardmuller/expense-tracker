import {
  createUser,
  isUserFullySetup,
  markUserAsOnboarded,
  markUserAsVerified,
  updateUser,
  type CreateUserParams,
  type User,
} from "@/domain/entities/user";
import { beforeEach, describe, expect, it } from "vitest";
import { generateMockUser, mockUsers } from "../__mocks__/user.mock";
import {
  UserAlreadyOnboardedError,
  UserAlreadyVerifiedError,
} from "./userErrors";

describe("createUser", () => {
  it("should create a user", () => {
    const mockParams: CreateUserParams = {
      email: "john@doe.com",
      name: "John",
    };
    const result = createUser(mockParams);
    expect(result.isOk()).toBeTruthy();
    if (result.isOk()) {
      expect(result.value.onboarded).toBe(false);
      expect(result.value.emailVerified).toBe(false);
    }
  });
});

describe("markUserAsOnboarded", () => {
  it("should mark the user as onboarded", () => {
    const users = mockUsers(5);

    for (const user of users) {
      user.onboarded = false;
      const result = markUserAsOnboarded(user);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.onboarded).toEqual(true);
      }
    }
  });

  it("should fail if user is already onboarded", () => {
    const user = generateMockUser();
    user.onboarded = true;
    const result = markUserAsOnboarded(user);
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(UserAlreadyOnboardedError);
    }
  });
});

describe("markUserAsVerified", () => {
  it("should mark the user as verified", () => {
    const users = mockUsers(5);

    for (const user of users) {
      user.emailVerified = false;
      const result = markUserAsVerified(user);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.emailVerified).toEqual(true);
      }
    }
  });

  it("should fail if user is already verified", () => {
    const user = generateMockUser();
    user.emailVerified = true;
    const result = markUserAsVerified(user);
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(UserAlreadyVerifiedError);
    }
  });
});

describe("updateUserProfile", () => {
  let mockUser: User;

  beforeEach(() => {
    mockUser = {
      id: "47d2aada-ac9d-4353-a95a-8dcea2aeb96f",
      name: "John Doe",
      email: "john@email.com",
      emailVerified: false,
      onboarded: true,
    };
  });

  it("should update user name", () => {
    const params = {
      ...mockUser,
      name: "Jane Doe",
    };

    const result = updateUser(mockUser, params);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.name).toEqual(params.name);
    }
  });

  it("should not update user email", () => {
    const params = {
      ...mockUser,
      email: "shouldnotwork@email.com",
    };

    const result = updateUser(mockUser, params);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.email).toEqual(mockUser.email);
    }
  });

  it("should not update any properties other than user name", () => {
    const params = generateMockUser();
    const result = updateUser(mockUser, params);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.email).toEqual(mockUser.email);
      expect(result.value.name).toEqual(params.name);
      expect(result.value.emailVerified).toEqual(mockUser.emailVerified);
      expect(result.value.onboarded).toEqual(mockUser.onboarded);
      expect(result.value.id).toEqual(mockUser.id);
    }
  });
});

describe("isUserFullySetup", () => {
  it("should return true if user is verified and onboarded", () => {
    const mock = generateMockUser();
    mock.emailVerified = true;
    mock.onboarded = true;

    const result = isUserFullySetup(mock);
    expect(result).toEqual(true);
  });

  it("should return false if user is not verified and not onboarded", () => {
    const mock = generateMockUser();
    mock.emailVerified = false;
    mock.onboarded = false;

    const result = isUserFullySetup(mock);
    expect(result).toEqual(false);
  });

  it("should return false if user is verified and not onboarded", () => {
    const mock = generateMockUser();
    mock.emailVerified = true;
    mock.onboarded = false;

    const result = isUserFullySetup(mock);
    expect(result).toEqual(false);
  });

  it("should return false if user is not verified and onboarded", () => {
    const mock = generateMockUser();
    mock.emailVerified = false;
    mock.onboarded = true;

    const result = isUserFullySetup(mock);
    expect(result).toEqual(false);
  });
});
