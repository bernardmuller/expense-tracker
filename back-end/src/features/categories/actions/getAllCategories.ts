import type { AppContext } from "@/lib/db/context";
import type { ResultAsync } from "neverthrow";
import type { EntityReadError } from "@/lib/errors/actionErrors";
import * as CategoryQueries from "../queries";
import type { CategoryWithoutMetadata } from "../types";

export const getAllCategories = (
  ctx: AppContext,
): ResultAsync<
  CategoryWithoutMetadata[],
  InstanceType<typeof EntityReadError>
> => CategoryQueries.findAll(ctx);
