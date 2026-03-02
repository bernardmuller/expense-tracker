import type { AppContext } from "@/lib/db/context";
import { categories, userCategories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { AppResult, fromDB } from "@/lib/result";
import { DatabaseError } from "@/lib/errors/domain";

export const getUserCategories = (
  userId: string,
  ctx: AppContext,
): AppResult<
  Array<{ id: string; key: string; label: string; icon: string }>,
  DatabaseError
> =>
  fromDB(
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
  );
