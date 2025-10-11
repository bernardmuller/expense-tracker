import { ResultAsync } from "neverthrow";
import { eq } from "drizzle-orm";
import { db } from "@/infrastructure/db";
import { users } from "@/infrastructure/db/schema";
import type { UserRepository } from "@/domain/repositories/userRepository";
import type { User } from "@/infrastructure/db/schema";
import type { ReadParams } from "@/domain/repositories/baseRepository";
import {
  EntityCreateError,
  EntityDeleteError,
  EntityNotFoundError,
  EntityReadError,
  EntityUpdateError,
} from "@/lib/errors/repositoryErrors";

const create = (user: User) =>
  ResultAsync.fromPromise(
    (async () => {
      const [createdUser] = await db
        .insert(users)
        .values({
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          onboarded: user.onboarded,
        })
        .returning();
      if (!createdUser) throw new EntityCreateError();
      return createdUser;
    })(),
    (error) => new EntityCreateError("User", error),
  );

const read = (_params?: ReadParams<User>) =>
  ResultAsync.fromPromise(
    (async () => {
      return await db.select().from(users);
    })(),
    (error) => new EntityReadError("User", error),
  );

const findById = (id: string) =>
  ResultAsync.fromPromise(
    (async () => {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      if (!user) throw new EntityNotFoundError(id);
      return user;
    })(),
    (error) => new EntityReadError("User", error),
  );

const update = (user: User) =>
  ResultAsync.fromPromise(
    (async () => {
      const [updatedUser] = await db
        .update(users)
        .set({
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          onboarded: user.onboarded,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id))
        .returning();
      if (!updatedUser) throw new EntityNotFoundError(user.id);
      return updatedUser;
    })(),
    (error) => new EntityUpdateError("User", error),
  );

const deleteUser = (user: User) =>
  ResultAsync.fromPromise(
    (async () => {
      await db.delete(users).where(eq(users.id, user.id));
      return true;
    })(),
    (error) => new EntityDeleteError("User", error),
  );

export const userRepositoryLive: UserRepository = {
  create,
  read,
  findById,
  update,
  delete: deleteUser,
};
