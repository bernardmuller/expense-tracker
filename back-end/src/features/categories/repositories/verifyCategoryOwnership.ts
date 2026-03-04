import type { AppContext } from "@/lib/db/context";
import { categories, userCategories } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { AppResult, fromDB, success, failure } from "@/lib/result";
import { DatabaseError, NotFoundError } from "@/lib/errors/domain";

export const verifyCategoryOwnership = (
  userId: string,
  categoryId: string,
  ctx: AppContext,
): AppResult<boolean, NotFoundError | DatabaseError> =>
  fromDB(
    ctx.db
      .select({ id: userCategories.id })
      .from(userCategories)
      .innerJoin(categories, eq(userCategories.categoryId, categories.id))
      .where(
        and(
          eq(userCategories.userId, userId),
          eq(userCategories.categoryId, categoryId),
        ),
      )
      .limit(1),
  ).andThen((rows) =>
    rows.length > 0
      ? success(true)
      : failure(new NotFoundError("Category")),
  );
