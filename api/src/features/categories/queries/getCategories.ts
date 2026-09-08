import type { AppContext } from "@/lib/db/context";
import { categories, userCategories } from "@/lib/db/schema";
import type { Category, CategoryWithoutMetadata } from "../types";
import { SearchQueries } from "@/lib/http/types";
import buildDrizzleQuery from "@/lib/utils/buildDrizzleQuery";
import { eq } from "drizzle-orm";
import { AppResult, fromDB } from "@/lib/result";
import { DatabaseError } from "@/lib/errors/domain";

export const getCategories = (
  search: SearchQueries<
    Category,
    {
      userId: string;
      key: string;
    }
  >,
  ctx: AppContext,
): AppResult<Array<CategoryWithoutMetadata>, DatabaseError> =>
  fromDB(
    buildDrizzleQuery(
      ctx.db
        .select({
          id: categories.id,
          key: categories.key,
          label: categories.label,
          icon: categories.icon,
        })
        .from(categories),
      // .leftJoin(userCategories, eq(categories.id, userCategories.categoryId)),
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
