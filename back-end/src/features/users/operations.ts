import { errAsync, ok, type ResultAsync } from "neverthrow";
import type { AppContext } from "@/lib/db/context";
import { generateUuid } from "@/lib/utils/generateUuid";
import { budgets, userCategories, categoryBudgets } from "@/lib/db/schema";
import * as UserQueries from "./queries";
import * as UserDomain from "./actions";
import type {
  CreateUserParams,
  User,
  UserAlreadyOnboardedError,
  UserAlreadyVerifiedError,
  OnboardingParams,
  CreateBudgetParams,
  UpdateUserPreferencesParams,
  UserPreferences,
} from "./types";
import type { Budget } from "@/lib/db/schema";
import {
  EntityCreateError,
  EntityNotFoundError,
  EntityReadError,
  EntityUpdateError,
} from "@/lib/errors/actionErrors";
import { UserEmailAlreadyInUseError } from "@/lib/errors/applicationErrors";
import {
  EncryptionCipherCreationError,
  EncryptionCipherUpdateError,
  EncryptionCipherFinalError,
} from "@/lib/utils/encryption";

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
    .andThen(() => errAsync(new UserEmailAlreadyInUseError(params.email)))
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

export const getUserByEmail = (
  email: string,
  ctx: AppContext,
): ResultAsync<
  User,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
> => UserQueries.findByEmail(email, ctx);

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

export const onboardUser = (
  userId: string,
  params: OnboardingParams,
  ctx: AppContext,
): ResultAsync<
  User,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
  | InstanceType<typeof UserAlreadyOnboardedError>
  | InstanceType<typeof EntityCreateError>
  | InstanceType<typeof EntityUpdateError>
  | InstanceType<typeof EncryptionCipherCreationError>
  | InstanceType<typeof EncryptionCipherUpdateError>
  | InstanceType<typeof EncryptionCipherFinalError>
> =>
  getUserById(userId, ctx).andThen((user: User) =>
    UserDomain.markUserAsOnboarded(user).asyncAndThen(() =>
      UserQueries.onboardUser(userId, params, ctx),
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

export const createNewBudget = (
  userId: string,
  params: CreateBudgetParams,
  ctx: AppContext,
): ResultAsync<
  Budget,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
  | InstanceType<typeof EntityCreateError>
  | InstanceType<typeof EntityUpdateError>
  | InstanceType<typeof EncryptionCipherCreationError>
  | InstanceType<typeof EncryptionCipherUpdateError>
  | InstanceType<typeof EncryptionCipherFinalError>
> => UserQueries.createNewBudget(userId, params, ctx);

export const getUserPreferences = (
  userId: string,
  ctx: AppContext,
): ResultAsync<
  UserPreferences,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
> =>
  UserQueries.findPreferencesByUserId(userId, ctx).map((prefs) => ({
    budgetStartDate: prefs.budgetStartDate,
    frequency: prefs.frequency as "weekly" | "bi-weekly" | "monthly" | "custom" | null,
    budgetStartDay: prefs.budgetStartDay,
    customDuration: prefs.customDuration,
  }));

export const updateUserPreferences = (
  userId: string,
  params: UpdateUserPreferencesParams,
  ctx: AppContext,
): ResultAsync<
  UserPreferences,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityUpdateError>
> =>
  UserQueries.updatePreferences(
    userId,
    {
      budgetStartDate: params.budgetStartDate ? new Date(params.budgetStartDate) : undefined,
      frequency: params.frequency,
      budgetStartDay: params.budgetStartDay,
      customDuration: params.customDuration,
    },
    ctx,
  ).map((prefs) => ({
    budgetStartDate: prefs.budgetStartDate,
    frequency: prefs.frequency as "weekly" | "bi-weekly" | "monthly" | "custom" | null,
    budgetStartDay: prefs.budgetStartDay,
    customDuration: prefs.customDuration,
  }));
