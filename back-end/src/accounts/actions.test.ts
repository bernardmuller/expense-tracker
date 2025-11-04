import { createAccount, updateAccount, updatePassword } from "./actions";
import type { CreateAccountParams, Account } from "./types";
import { beforeEach, describe, expect, it } from "vitest";
import { generateMockAccount, mockAccounts } from "@/test/mocks/account.mock";
import { generateUuid } from "@/lib/utils/generateUuid";

describe("createAccount", () => {
  it("should create an account", () => {
    const mockParams: CreateAccountParams = {
      userId: generateUuid(),
    };
    const result = createAccount(mockParams);
    expect(result.isOk()).toBeTruthy();
    if (result.isOk()) {
      expect(result.value.userId).toBe(mockParams.userId);
      expect(result.value.accessToken).toBe(null);
      expect(result.value.refreshToken).toBe(null);
      expect(result.value.idToken).toBe(null);
      expect(result.value.id).toBeTruthy();
    }
  });
});

describe("updateAccount", () => {
  let mockAccount: Account;

  beforeEach(() => {
    mockAccount = generateMockAccount();
  });

  it("should update account access token", () => {
    const newAccessToken = "new_access_token";
    const result = updateAccount(mockAccount, {
      accessToken: newAccessToken,
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.accessToken).toEqual(newAccessToken);
    }
  });

  it("should update account refresh token and expiry", () => {
    const newRefreshToken = "new_refresh_token";
    const expiresAt = new Date();
    const result = updateAccount(mockAccount, {
      refreshToken: newRefreshToken,
      refreshTokenExpiresAt: expiresAt,
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.refreshToken).toEqual(newRefreshToken);
      expect(result.value.refreshTokenExpiresAt).toEqual(expiresAt);
    }
  });

  it("should update multiple fields at once", () => {
    const updates = {
      accessToken: "new_access",
      refreshToken: "new_refresh",
      idToken: "new_id_token",
      scope: "some_scope",
    };

    const result = updateAccount(mockAccount, updates);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.accessToken).toEqual(updates.accessToken);
      expect(result.value.refreshToken).toEqual(updates.refreshToken);
      expect(result.value.idToken).toEqual(updates.idToken);
      expect(result.value.scope).toEqual(updates.scope);
      expect(result.value.userId).toEqual(mockAccount.userId);
    }
  });

  it("should not update userId or id", () => {
    const newUserId = generateUuid();
    const newId = generateUuid();
    const result = updateAccount(mockAccount, {
      userId: newUserId,
      id: newId,
    } as Partial<Account>);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.userId).toEqual(mockAccount.userId);
      expect(result.value.id).toEqual(mockAccount.id);
    }
  });

  it("should handle null values correctly", () => {
    mockAccount.accessToken = "existing_token";
    const result = updateAccount(mockAccount, {
      accessToken: null,
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.accessToken).toBe(null);
    }
  });
});
