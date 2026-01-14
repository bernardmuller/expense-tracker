import type { AppContext } from "@/lib/db/context";
import { categories, userCategories } from "@/lib/db/schema";
import { EntityReadError } from "@/lib/errors/actionErrors";
import { eq } from "drizzle-orm";
import { ResultAsync } from "neverthrow";

export const getUserCategories = (
  userId: string,
  ctx: AppContext,
): ResultAsync<
  Array<{ id: string; key: string; label: string; icon: string }>,
  InstanceType<typeof EntityReadError>
> =>
  ResultAsync.fromPromise(
    ctx.db
      .select({
        id: categories.id,
        key: categories.key,
        label: categories.label,
        icon: categories.icon,
      })
      .from(userCategories)
      .innerJoin(categories, eq(userCategories.categoryId, categories.id))
      .where(eq(userCategories.userId, userId)),
    (error) => new EntityReadError("UserCategories", String(error)),
  );
