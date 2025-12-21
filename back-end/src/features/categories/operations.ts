import type { AppContext } from "@/lib/db/context";
import { EntityReadError } from "@/lib/errors/actionErrors";
import { type ResultAsync } from "neverthrow";
import * as CategoryQueries from "./queries";
import type { Category, CategoryWithoutMetadata } from "./types";
import { SearchQueries } from "@/lib/http/types";

export const getCategories = (
  search: SearchQueries<
    Category,
    {
      userId: string;
      key: string;
    }
  >,
  ctx: AppContext,
): ResultAsync<
  Array<CategoryWithoutMetadata>,
  InstanceType<typeof EntityReadError>
> => CategoryQueries.getCategories(search, ctx);
