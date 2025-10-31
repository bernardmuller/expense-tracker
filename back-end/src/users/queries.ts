import type { AppContext } from "@/db/context";
import { users } from "@/db/schema";
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
