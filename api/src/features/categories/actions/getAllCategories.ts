import type { AppContext } from "@/lib/db/context";
import * as CategoryQueries from "../queries/index";
import type { CategoryWithoutMetadata } from "../types";
import { AppResult } from "@/lib/result";

export const getAllCategories = (
  ctx: AppContext,
): AppResult<CategoryWithoutMetadata[]> => CategoryQueries.findAll(ctx);
