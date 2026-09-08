import type { AppContext } from "@/lib/db/context";
import { AppResult } from "@/lib/result";
import type { Category, CategoryWithoutMetadata } from "../types";
import type { SearchQueries } from "@/lib/http/types";
import * as CategoryRepo from "../repositories";

export const getCategories = (
  search: SearchQueries<
    Category,
    {
      userId: string;
      key: string;
    }
  >,
  ctx: AppContext,
): AppResult<Array<CategoryWithoutMetadata>> => {
  return CategoryRepo.findCategories(search, ctx);
};
