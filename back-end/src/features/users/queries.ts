import type { AppContext } from "@/lib/db/context";
import { users } from "@/lib/db/schema";
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
import type { OnboardingParams } from "./types";
import { generateUuid } from "@/lib/utils/generateUuid";
import { budgets, userCategories, categoryBudgets } from "@/lib/db/schema";

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
> =>
  findById(userId, ctx).andThen(() =>
    ResultAsync.fromPromise(
      ctx.db.transaction(async (tx) => {
        const budgetId = generateUuid();
        const now = new Date();

        const [budget] = await tx
          .insert(budgets)
          .values({
            id: budgetId,
            userId,
            name: params.name,
            startAmount: params.startAmount.toString(),
            currentAmount: params.startAmount.toString(),
            isActive: true,
            createdAt: now,
            updatedAt: now,
          })
          .returning();

        console.log("budget");

        if (!budget) throw new EntityCreateError("Budget");

        const userCategoryInserts = params.categories.map((cat) => ({
          id: generateUuid(),
          userId,
          categoryId: cat.id,
          createdAt: now,
          updatedAt: now,
        }));

        await tx.insert(userCategories).values(userCategoryInserts).onConflictDoNothing();

        console.log("user categories");

        // Create category budgets
        const categoryBudgetInserts = params.categories.map((cat) => ({
          id: generateUuid(),
          budgetId,
          categoryId: cat.id,
          allocatedAmount: cat.amount.toString(),
          createdAt: now,
          updatedAt: now,
        }));

        await tx.insert(categoryBudgets).values(categoryBudgetInserts);

        console.log("category budgets");

        // Update user as onboarded
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
        error instanceof EntityCreateError || error instanceof EntityUpdateError
          ? error
          : new EntityCreateError("Onboarding", error),
    ),
  );
