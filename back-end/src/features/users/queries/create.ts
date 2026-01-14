import type { AppContext } from "@/lib/db/context";
import { users, userPreferences } from "@/lib/db/schema";
import { EntityCreateError } from "@/lib/errors/actionErrors";
import { ResultAsync } from "neverthrow";
import type { User } from "../types";
import { generateUuid } from "@/lib/utils/generateUuid";

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
