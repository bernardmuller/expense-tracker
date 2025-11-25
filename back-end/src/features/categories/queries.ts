import type { AppContext } from "@/lib/db/context";
import { categories } from "@/lib/db/schema";
import { EntityReadError } from "@/lib/errors/actionErrors";
import { ResultAsync } from "neverthrow";
import type { Category, CategoryWithoutMetadata } from "./types";

export const findAll = (
  ctx: AppContext,
): ResultAsync<
  CategoryWithoutMetadata[],
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
      .from(categories),
    (error) => new EntityReadError("Category", String(error)),
  );
