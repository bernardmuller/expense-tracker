import type { AppContext } from "@/lib/db/context";
import { categories } from "@/lib/db/schema";
import { EntityNotFoundError, EntityReadError } from "@/lib/errors/actionErrors";
import { eq } from "drizzle-orm";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

export const findCategoryById = (
  categoryId: string,
  ctx: AppContext,
): ResultAsync<
  { id: string },
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
> =>
  ResultAsync.fromPromise(
    ctx.db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.id, categoryId)),
    (error) => new EntityReadError("Category", String(error)),
  ).andThen(([category]) =>
    category
      ? okAsync(category)
      : errAsync(new EntityNotFoundError(`Category: ${categoryId}`)),
  );
