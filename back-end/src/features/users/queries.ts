import type { AppContext } from "@/lib/db/context";
import { userPreferences, users } from "@/lib/db/schema";
import {
  EntityCreateError,
  EntityDeleteError,
  EntityNotFoundError,
  EntityReadError,
  EntityUpdateError,
} from "@/lib/errors/actionErrors";
import { eq } from "drizzle-orm";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import type { User } from "./types";
import type { OnboardingParams, CreateBudgetParams } from "./types";
import { generateUuid } from "@/lib/utils/generateUuid";
import {
  budgets,
  userCategories,
  categoryBudgets,
  userPreferences,
} from "@/lib/db/schema";
import type { Budget, UserPreferences } from "@/lib/db/schema";

import {
  encrypt,
  EncryptionCipherCreationError,
  EncryptionCipherUpdateError,
  EncryptionCipherFinalError,
} from "@/lib/utils/encryption";

export const create = (user: Partial<User>, ctx: AppContext) =>
  ResultAsync.fromPromise(
    (async () => {
      if (!user.id || !user.name || !user.email) {
        throw new Error("Missing required fields: id, name, or email");
      }
      const [createdUser] = await ctx.db
        .insert(users)
        .values({
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified ?? false,
          onboarded: user.onboarded ?? false,
          image: user.image,
        })
        .returning();

      const [createdUserPreference] = await ctx.db
        .insert(userPreferences)
        .values({
          id: generateUuid(),
          userId: user.id,
          budgetStartDate: null,
        });

      if (!createdUser) throw new EntityCreateError("User");
      return createdUser;
    })(),
    (error) =>
      error instanceof EntityCreateError
        ? error
        : new EntityCreateError("User", error),
  );

export const findAll = (ctx: AppContext) =>
  ResultAsync.fromPromise(
    (async () => {
      return await ctx.db.select().from(users);
    })(),
    (error) => new EntityReadError("User", error),
  );

export const findById = (
  id: string,
  ctx: AppContext,
): ResultAsync<
  User,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
> =>
  ResultAsync.fromPromise(
    ctx.db.select().from(users).where(eq(users.id, id)),
    (error) => new EntityReadError("User", String(error)),
  ).andThen(([user]) =>
    user ? okAsync(user) : errAsync(new EntityNotFoundError(`User: ${id}`)),
  );

export const findByEmail = (
  email: string,
  ctx: AppContext,
): ResultAsync<
  User,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
> =>
  ResultAsync.fromPromise(
    ctx.db.select().from(users).where(eq(users.email, email)),
    (error) => new EntityReadError("User", String(error)),
  ).andThen(([user]) =>
    user ? okAsync(user) : errAsync(new EntityNotFoundError(email)),
  );

export const update = (
  user: User,
  ctx: AppContext,
): ResultAsync<User, InstanceType<typeof EntityUpdateError>> =>
  ResultAsync.fromPromise(
    ctx.db
      .update(users)
      .set({
        ...user,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id))
      .returning(),
    (error) => new EntityUpdateError("User", error),
  ).andThen(([updatedUser]) =>
    updatedUser
      ? okAsync(updatedUser)
      : errAsync(new EntityUpdateError("User")),
  );

export const deleteUser = (userId: string, ctx: AppContext) =>
  ResultAsync.fromPromise(
    (async () => {
      await ctx.db.delete(users).where(eq(users.id, userId));
      return true;
    })(),
    (error) => new EntityDeleteError("User", error),
  );

export const onboardUser = (
  userId: string,
  params: OnboardingParams,
  ctx: AppContext,
): ResultAsync<
  User,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
  | InstanceType<typeof EntityCreateError>
  | InstanceType<typeof EntityUpdateError>
  | InstanceType<typeof EncryptionCipherCreationError>
  | InstanceType<typeof EncryptionCipherUpdateError>
  | InstanceType<typeof EncryptionCipherFinalError>
> =>
  findById(userId, ctx).andThen(() =>
    ResultAsync.fromPromise(
      ctx.db.transaction(async (tx) => {
        const budgetId = generateUuid();
        const now = new Date();

        const encryptStartResult = await encrypt(params.startAmount.toString());
        if (encryptStartResult.isErr()) {
          throw encryptStartResult.error;
        }
        const encryptedStart = encryptStartResult.value;

        const encryptCurrentResult = await encrypt(
          params.startAmount.toString(),
        );
        if (encryptCurrentResult.isErr()) {
          throw encryptCurrentResult.error;
        }
        const encryptedCurrent = encryptCurrentResult.value;

        const [budget] = await tx
          .insert(budgets)
          .values({
            id: budgetId,
            userId,
            name: params.name,
            startAmount: encryptedStart.ciphertext,
            currentAmount: encryptedCurrent.ciphertext,
            sa_iv: encryptedStart.iv,
            sa_tag: encryptedStart.tag,
            ca_iv: encryptedCurrent.iv,
            ca_tag: encryptedCurrent.tag,
            isActive: true,
            startDate: params.startDate,
            endDate: params.endDate,
            createdAt: now,
            updatedAt: now,
          })
          .returning();

        if (!budget) throw new EntityCreateError("Budget");

        const userPrefs = await tx
          .insert(userPreferences)
          .values({
            id: generateUuid(),
            userId,
            budgetStartDate: params.startDate,
            frequency: params.budgetFrequency,
            customDuration: params.customDuration,
            updatedAt: now,
          })
          .returning();

        if (!userPrefs) throw new EntityCreateError("UserPreferences");

        const userCategoryInserts = params.categories.map((cat) => ({
          id: generateUuid(),
          userId,
          categoryId: cat.id,
          createdAt: now,
          updatedAt: now,
        }));

        await tx
          .insert(userCategories)
          .values(userCategoryInserts)
          .onConflictDoNothing();

        const categoryBudgetInserts = params.categories.map((cat) => ({
          id: generateUuid(),
          budgetId,
          categoryId: cat.id,
          allocatedAmount: cat.amount.toString(),
          createdAt: now,
          updatedAt: now,
        }));

        await tx.insert(categoryBudgets).values(categoryBudgetInserts);

        const [updatedUser] = await tx
          .update(users)
          .set({
            onboarded: true,
            updatedAt: now,
          })
          .where(eq(users.id, userId))
          .returning();

        if (!updatedUser) throw new EntityUpdateError("User");

        console.log("user");

        return updatedUser;
      }),
      (error) =>
        error instanceof EntityCreateError ||
        error instanceof EntityUpdateError ||
        error instanceof EncryptionCipherCreationError ||
        error instanceof EncryptionCipherUpdateError ||
        error instanceof EncryptionCipherFinalError
          ? error
          : new EntityCreateError("Onboarding", error),
    ),
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
> =>
  findById(userId, ctx).andThen(() =>
    ResultAsync.fromPromise(
      ctx.db.transaction(async (tx) => {
        const budgetId = generateUuid();
        const now = new Date();

        await tx
          .update(budgets)
          .set({
            isActive: false,
            updatedAt: now,
          })
          .where(eq(budgets.userId, userId));

        const encryptStartResult = await encrypt(params.startAmount.toString());
        if (encryptStartResult.isErr()) {
          throw encryptStartResult.error;
        }
        const encryptedStart = encryptStartResult.value;

        const encryptCurrentResult = await encrypt(
          params.startAmount.toString(),
        );
        if (encryptCurrentResult.isErr()) {
          throw encryptCurrentResult.error;
        }
        const encryptedCurrent = encryptCurrentResult.value;

        const [budget] = await tx
          .insert(budgets)
          .values({
            id: budgetId,
            userId,
            name: params.name,
            startAmount: encryptedStart.ciphertext,
            currentAmount: encryptedCurrent.ciphertext,
            sa_iv: encryptedStart.iv,
            sa_tag: encryptedStart.tag,
            ca_iv: encryptedCurrent.iv,
            ca_tag: encryptedCurrent.tag,
            isActive: true,
            createdAt: now,
            updatedAt: now,
          })
          .returning();

        if (!budget) throw new EntityCreateError("Budget");

        const userCategoryInserts = params.categories.map((cat) => ({
          id: generateUuid(),
          userId,
          categoryId: cat.id,
          createdAt: now,
          updatedAt: now,
        }));

        await tx
          .insert(userCategories)
          .values(userCategoryInserts)
          .onConflictDoNothing();

        const categoryBudgetInserts = params.categories.map((cat) => ({
          id: generateUuid(),
          budgetId,
          categoryId: cat.id,
          allocatedAmount: cat.amount.toString(),
          createdAt: now,
          updatedAt: now,
        }));

        await tx.insert(categoryBudgets).values(categoryBudgetInserts);

        return budget;
      }),
      (error) =>
        error instanceof EntityCreateError ||
        error instanceof EntityUpdateError ||
        error instanceof EncryptionCipherCreationError ||
        error instanceof EncryptionCipherUpdateError ||
        error instanceof EncryptionCipherFinalError
          ? error
          : new EntityCreateError("Budget creation", error),
    ),
  );

export const findPreferencesByUserId = (
  userId: string,
  ctx: AppContext,
): ResultAsync<
  UserPreferences,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
> =>
  ResultAsync.fromPromise(
    ctx.db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId)),
    (error) => new EntityReadError("UserPreferences", String(error)),
  ).andThen(([prefs]) =>
    prefs
      ? okAsync(prefs)
      : errAsync(new EntityNotFoundError(`UserPreferences: ${userId}`)),
  );

export const updatePreferences = (
  userId: string,
  preferences: Partial<UserPreferences>,
  ctx: AppContext,
): ResultAsync<
  UserPreferences,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityUpdateError>
> =>
  ResultAsync.fromPromise(
    ctx.db
      .update(userPreferences)
      .set({
        ...preferences,
        updatedAt: new Date(),
      })
      .where(eq(userPreferences.userId, userId))
      .returning(),
    (error) => new EntityUpdateError("UserPreferences", error),
  ).andThen(([updatedPrefs]) =>
    updatedPrefs
      ? okAsync(updatedPrefs)
      : errAsync(new EntityNotFoundError(`UserPreferences: ${userId}`)),
  );
