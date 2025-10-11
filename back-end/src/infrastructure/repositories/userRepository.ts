import { Effect, Layer } from "effect";
import { eq } from "drizzle-orm";
import { db } from "@/infrastructure/db";
import { users } from "@/infrastructure/db/schema";
import { UserRepository } from "@/domain/repositories/userRepository";
import type { User } from "@/domain/entities/user";
import type { ReadParams } from "@/domain/repositories/baseRepository";
import {
  EntityCreateError,
  EntityDeleteError,
  EntityNotFoundError,
  EntityReadError,
  EntityUpdateError,
} from "@/domain/errors/repositoryErrors";

export const userRepositoryLive = Layer.succeed(
  UserRepository,
  UserRepository.of({
    create: (user: User) =>
      Effect.tryPromise({
        try: async () => {
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

          if (!createdUser) {
            throw new Error("No user returned from database");
          }

          return {
            id: createdUser.id,
            name: createdUser.name,
            email: createdUser.email,
            emailVerified: createdUser.emailVerified,
            onboarded: createdUser.onboarded,
          } satisfies User;
        },
        catch: (error) =>
          new EntityCreateError({
            entityType: "User",
            message: `Failed to create user: ${error}`,
            cause: error,
          }),
      }),

    read: (_params?: ReadParams<User>) =>
      Effect.tryPromise({
        try: async () => {
          const result = await db.select().from(users);

          return result.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified,
            onboarded: user.onboarded,
          }));
        },
        catch: (error) =>
          new EntityReadError({
            entityType: "User",
            message: `Failed to read users: ${error}`,
            cause: error,
          }),
      }),

    findById: (id: string) =>
      Effect.tryPromise({
        try: async () => {
          const [user] = await db.select().from(users).where(eq(users.id, id));

          if (!user) {
            throw new EntityNotFoundError({
              entityType: "User",
              id,
              message: `User with id ${id} not found`,
            });
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified,
            onboarded: user.onboarded,
          };
        },
        catch: (error) => {
          // If it's already an EntityNotFoundError, return it as-is
          if (error instanceof EntityNotFoundError) {
            return error;
          }
          // Otherwise, wrap it in EntityReadError
          return new EntityReadError({
            entityType: "User",
            message: `Failed to find user: ${error}`,
            cause: error,
          });
        },
      }),

    update: (user: User) =>
      Effect.tryPromise({
        try: async () => {
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

          if (!updatedUser) {
            throw new EntityNotFoundError({
              entityType: "User",
              id: user.id,
              message: `User with id ${user.id} not found for update`,
            });
          }

          return {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            emailVerified: updatedUser.emailVerified,
            onboarded: updatedUser.onboarded,
          };
        },
        catch: (error) => {
          // If it's already an EntityNotFoundError, return it as-is
          if (error instanceof EntityNotFoundError) {
            return error;
          }
          // Otherwise, wrap it in EntityUpdateError
          return new EntityUpdateError({
            entityType: "User",
            id: user.id,
            message: `Failed to update user: ${error}`,
            cause: error,
          });
        },
      }),

    delete: (user: User) =>
      Effect.tryPromise({
        try: async () => {
          await db.delete(users).where(eq(users.id, user.id));
          return true;
        },
        catch: (error) =>
          new EntityDeleteError({
            entityType: "User",
            id: user.id,
            message: `Failed to delete user: ${error}`,
            cause: error,
          }),
      }),
  }),
);
