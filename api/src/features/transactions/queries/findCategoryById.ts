import type { AppContext } from "@/lib/db/context";
import { categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { AppResult, fromDB, success, failure } from "@/lib/result";
import { NotFoundError, DatabaseError } from "@/lib/errors/domain";

export const findCategoryById = (
  categoryId: string,
  ctx: AppContext,
): AppResult<{ id: string }, NotFoundError | DatabaseError> =>
  fromDB(
    ctx.db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.id, categoryId)),
  ).andThen(([category]) =>
    category
      ? success(category)
      : failure(new NotFoundError(`Category: ${categoryId}`)),
  );
