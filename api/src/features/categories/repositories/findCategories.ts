import type { AppContext } from "@/lib/db/context";
import { categories, userCategories } from "@/lib/db/schema";
import { AppResult, fromDB } from "@/lib/result";
import { DatabaseError } from "@/lib/errors/domain";
import type { Category, CategoryWithoutMetadata } from "../types";
import type { SearchQueries } from "@/lib/http/types";
import buildDrizzleQuery from "@/lib/utils/buildDrizzleQuery";
import { eq } from "drizzle-orm";

export const findCategories = (
  search: SearchQueries<
    Category,
    {
      userId: string;
      key: string;
    }
  >,
  ctx: AppContext,
): AppResult<Array<CategoryWithoutMetadata>, DatabaseError> => {
  return fromDB(
    buildDrizzleQuery(
      ctx.db
        .select({
          id: categories.id,
          key: categories.key,
          label: categories.label,
          icon: categories.icon,
        })
        .from(categories),
      search,
      {
        userId: (value) => eq(userCategories.userId, value),
        key: (value) => eq(categories.key, value),
      },
      {
        key: categories.key,
        createdAt: categories.createdAt,
      },
    ),
  );
};
