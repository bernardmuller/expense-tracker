import { generateUuid } from "@/lib/utils/generateUuid";
import { ok, type Result } from "neverthrow";
import type { CreateAccountParams, Account } from "./types";

export const createAccount = (
  params: CreateAccountParams,
): Result<Account, never> => {
  const uuid = generateUuid();
  const now = new Date();
  return ok({
    ...params,
    id: uuid,
    userId: params.userId,
    password: null,
    idToken: null,
    accessToken: null,
    refreshToken: null,
    accessTokenExpiresAt: null,
    refreshTokenExpiresAt: null,
    scope: null,
    createdAt: now,
    updatedAt: now,
  });
};

export const updateAccount = (
  account: Account,
  updates: Partial<Account>,
): Result<Account, never> => {
  return ok({
    ...account,
    accessToken:
      updates.accessToken !== undefined
        ? updates.accessToken
        : account.accessToken,
    refreshToken:
      updates.refreshToken !== undefined
        ? updates.refreshToken
        : account.refreshToken,
    idToken: updates.idToken !== undefined ? updates.idToken : account.idToken,
    accessTokenExpiresAt:
      updates.accessTokenExpiresAt !== undefined
        ? updates.accessTokenExpiresAt
        : account.accessTokenExpiresAt,
    refreshTokenExpiresAt:
      updates.refreshTokenExpiresAt !== undefined
        ? updates.refreshTokenExpiresAt
        : account.refreshTokenExpiresAt,
    scope: updates.scope !== undefined ? updates.scope : account.scope,
  });
};

export const updatePassword = (
  account: Account,
  newPassword: string,
): Result<Account, never> => {
  return ok({
    ...account,
    password: newPassword,
  });
};
