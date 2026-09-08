import type { AppContext } from "@/lib/db/context";
import { users, userPreferences } from "@/lib/db/schema";
import type { User } from "@/lib/db/schema";
import { generateUuid } from "@/lib/utils/generateUuid";
import { AppResult, fromDB, success, failure } from "@/lib/result";
import { DatabaseError, ValidationError } from "@/lib/errors/domain";

export const create = (
  user: Partial<User>,
  ctx: AppContext,
): AppResult<User, DatabaseError | ValidationError> => {
  if (!user.id || !user.name || !user.email) {
    return failure(
      new ValidationError("Missing required fields: id, name, or email"),
    );
  }

  return fromDB(
    ctx.db.transaction(async (tx) => {
      const [createdUser] = await tx
        .insert(users)
        .values({
          id: user.id!,
          name: user.name!,
          email: user.email!,
          emailVerified: user.emailVerified ?? false,
          onboarded: user.onboarded ?? false,
          image: user.image,
        })
        .returning();

      await tx.insert(userPreferences).values({
        id: generateUuid(),
        userId: user.id!,
        budgetStartDate: null,
      });

      if (!createdUser) throw new Error("Failed to create user");
      return createdUser;
    }),
  ).andThen((user) =>
    user ? success(user) : failure(new DatabaseError("Failed to create user")),
  );
};
