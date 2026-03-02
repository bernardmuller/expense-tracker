import type { AppContext } from "@/lib/db/context";
import type { CategoryWithoutMetadata } from "../types";
import { getCategories } from "./getCategories";
import { AppResult } from "@/lib/result";
import { DatabaseError } from "@/lib/errors/domain";

// Alias for backwards compatibility
export const findAll = (
  ctx: AppContext,
): AppResult<Array<CategoryWithoutMetadata>, DatabaseError> =>
  getCategories({}, ctx);
