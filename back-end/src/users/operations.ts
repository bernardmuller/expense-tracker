import { errAsync, ok, type ResultAsync } from "neverthrow";
import type { AppContext } from "@/db/context";
import * as UserQueries from "./queries";
import * as UserDomain from "./types";
import type {
  CreateUserParams,
  User,
  UserEmailAlreadyInUseError,
  UserAlreadyOnboardedError,
  UserAlreadyVerifiedError,
} from "./types";
import {
  EntityCreateError,
  EntityNotFoundError,
  EntityReadError,
  EntityUpdateError,
} from "@/lib/errors/repositoryErrors";

export const createUser = (
  params: CreateUserParams,
  ctx: AppContext,
): ResultAsync<
  User,
  | InstanceType<typeof UserEmailAlreadyInUseError>
  | InstanceType<typeof EntityCreateError>
  | InstanceType<typeof EntityReadError>
> =>
  UserQueries.findByEmail(params.email, ctx)
    .andThen(() =>
      errAsync(new UserDomain.UserEmailAlreadyInUseError(params.email)),
    )
    .orElse((error) =>
      error instanceof EntityNotFoundError
        ? UserDomain.createUser(params).asyncAndThen((user) =>
            UserQueries.create(user, ctx),
          )
        : errAsync(error),
    );

export const getUserById = (
  id: string,
  ctx: AppContext,
): ResultAsync<
  User,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
> => UserQueries.findById(id, ctx);

export const getAllUsers = (
  ctx: AppContext,
): ResultAsync<User[], InstanceType<typeof EntityReadError>> =>
  UserQueries.findAll(ctx);

export const markUserAsOnboarded = (
  userId: string,
  ctx: AppContext,
): ResultAsync<
  User,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
  | InstanceType<typeof UserAlreadyOnboardedError>
  | InstanceType<typeof EntityUpdateError>
> =>
  getUserById(userId, ctx).andThen((user: User) =>
    UserDomain.markUserAsOnboarded(user).asyncAndThen((user) =>
      UserQueries.update(user, ctx),
    ),
  );

export const markUserAsVerified = (
  userId: string,
  ctx: AppContext,
): ResultAsync<
  User,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
  | InstanceType<typeof UserAlreadyVerifiedError>
  | InstanceType<typeof EntityUpdateError>
> =>
  getUserById(userId, ctx).andThen((user: User) =>
    UserDomain.markUserAsVerified(user).asyncAndThen((user) =>
      UserQueries.update(user, ctx),
    ),
  );

export const updateUser = (
  userId: string,
  updates: Partial<User>,
  ctx: AppContext,
): ResultAsync<
  User,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
  | InstanceType<typeof EntityUpdateError>
> =>
  getUserById(userId, ctx).andThen((user: User) =>
    UserDomain.updateUser(user, updates).asyncAndThen((user) =>
      UserQueries.update(user, ctx),
    ),
  );

export const isUserFullySetup = (
  userId: string,
  ctx: AppContext,
): ResultAsync<
  boolean,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
> =>
  getUserById(userId, ctx).andThen((user: User) =>
    ok(UserDomain.isUserFullySetup(user)),
  );
