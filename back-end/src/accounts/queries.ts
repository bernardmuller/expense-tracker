import type { AppContext } from "@/db/context";
import { accounts } from "@/db/schema";
import {
  EntityCreateError,
  EntityDeleteError,
  EntityNotFoundError,
  EntityReadError,
  EntityUpdateError,
} from "@/lib/errors/actionErrors";
import { eq } from "drizzle-orm";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import type { Account, CreateAccountParams } from "./types";
import { generateUuid } from "@/lib/utils/generateUuid";

export const create = (
  account: Partial<CreateAccountParams>,
  ctx: AppContext,
) =>
  ResultAsync.fromPromise(
    (async () => {
      if (!account.userId || !account.password) {
        throw new Error("Missing required fields: userId, or password");
      }
      const now = new Date();
      const [createdAccount] = await ctx.db
        .insert(accounts)
        .values({
          id: generateUuid(),
          userId: account.userId,
          password: account.password,
          accessToken: null,
          refreshToken: null,
          idToken: null,
          accessTokenExpiresAt: null,
          refreshTokenExpiresAt: null,
          scope: null,
          createdAt: now,
          updatedAt: now,
        })
        .returning();
      if (!createdAccount) throw new EntityCreateError("Account");
      return createdAccount;
    })(),
    (error) =>
      error instanceof EntityCreateError
        ? error
        : new EntityCreateError(String(error), error),
  );

export const findAll = (ctx: AppContext) =>
  ResultAsync.fromPromise(
    ctx.db.select().from(accounts),
    (error) => new EntityReadError("Account", error),
  );

export const findById = (
  id: string,
  ctx: AppContext,
): ResultAsync<
  Account,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
> =>
  ResultAsync.fromPromise(
    ctx.db.select().from(accounts).where(eq(accounts.id, id)),
    (error) => new EntityReadError("Account", String(error)),
  ).andThen(([account]) =>
    account
      ? okAsync(account)
      : errAsync(new EntityNotFoundError(`Account: ${id}`)),
  );

export const findByUserId = (
  userId: string,
  ctx: AppContext,
): ResultAsync<
  Account,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
> =>
  ResultAsync.fromPromise(
    ctx.db.select().from(accounts).where(eq(accounts.userId, userId)),
    (error) => new EntityReadError("Account", String(error)),
  ).andThen(([account]) =>
    account
      ? okAsync(account)
      : errAsync(new EntityNotFoundError(`Account for user: ${userId}`)),
  );

export const update = (
  account: Account,
  ctx: AppContext,
): ResultAsync<Account, InstanceType<typeof EntityUpdateError>> =>
  ResultAsync.fromPromise(
    ctx.db
      .update(accounts)
      .set({
        ...account,
        updatedAt: new Date(),
      })
      .where(eq(accounts.id, account.id))
      .returning(),
    (error) => new EntityUpdateError("Account", error),
  ).andThen(([updatedAccount]) =>
    updatedAccount
      ? okAsync(updatedAccount)
      : errAsync(new EntityUpdateError("Account")),
  );

export const deleteAccount = (accountId: string, ctx: AppContext) =>
  ResultAsync.fromPromise(
    (async () => {
      await ctx.db.delete(accounts).where(eq(accounts.id, accountId));
      return true;
    })(),
    (error) => new EntityDeleteError("Account", error),
  );
