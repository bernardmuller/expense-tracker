import { errAsync, ok, type ResultAsync } from "neverthrow";
import type { AppContext } from "@/db/context";
import * as AccountQueries from "./queries";
import * as AccountDomain from "./actions";
import type { CreateAccountParams, Account } from "./types";
import { AccountAlreadyExistsError } from "./types";
import {
  EntityCreateError,
  EntityNotFoundError,
  EntityReadError,
  EntityUpdateError,
  EntityDeleteError,
} from "@/lib/errors/actionErrors";

export const createAccount = (
  params: CreateAccountParams,
  ctx: AppContext,
): ResultAsync<
  Account,
  | InstanceType<typeof AccountAlreadyExistsError>
  | InstanceType<typeof EntityCreateError>
  | InstanceType<typeof EntityReadError>
> =>
  AccountQueries.findByUserId(params.userId, ctx)
    .andThen(() => errAsync(new AccountAlreadyExistsError(params.userId)))
    .orElse((error) =>
      error instanceof EntityNotFoundError
        ? AccountDomain.createAccount(params).asyncAndThen((account) =>
            AccountQueries.create(account, ctx),
          )
        : errAsync(error),
    );

export const getAccountById = (
  id: string,
  ctx: AppContext,
): ResultAsync<
  Account,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
> => AccountQueries.findById(id, ctx);

export const getAccountByUserId = (
  userId: string,
  ctx: AppContext,
): ResultAsync<
  Account,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
> => AccountQueries.findByUserId(userId, ctx);

export const getAllAccounts = (
  ctx: AppContext,
): ResultAsync<Account[], InstanceType<typeof EntityReadError>> =>
  AccountQueries.findAll(ctx);

export const updateAccount = (
  accountId: string,
  updates: Partial<Account>,
  ctx: AppContext,
): ResultAsync<
  Account,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
  | InstanceType<typeof EntityUpdateError>
> =>
  getAccountById(accountId, ctx).andThen((account: Account) =>
    AccountDomain.updateAccount(account, updates).asyncAndThen((account) =>
      AccountQueries.update(account, ctx),
    ),
  );

export const updatePassword = (
  accountId: string,
  newPassword: string,
  ctx: AppContext,
): ResultAsync<
  Account,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
  | InstanceType<typeof EntityUpdateError>
> =>
  getAccountById(accountId, ctx).andThen((account: Account) =>
    AccountDomain.updatePassword(account, newPassword).asyncAndThen((account) =>
      AccountQueries.update(account, ctx),
    ),
  );

export const deleteAccount = (
  accountId: string,
  ctx: AppContext,
): ResultAsync<
  boolean,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
  | InstanceType<typeof EntityDeleteError>
> =>
  getAccountById(accountId, ctx).andThen(() =>
    AccountQueries.deleteAccount(accountId, ctx),
  );
