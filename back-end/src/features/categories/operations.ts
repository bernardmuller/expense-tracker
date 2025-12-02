import type { AppContext } from "@/lib/db/context";
import { EntityReadError } from "@/lib/errors/actionErrors";
import { type ResultAsync } from "neverthrow";
import * as CategoryQueries from "./queries";
import type { CategoryWithoutMetadata } from "./types";

export const getAllCategories = (
  ctx: AppContext,
): ResultAsync<
  CategoryWithoutMetadata[],
  InstanceType<typeof EntityReadError>
> => CategoryQueries.findAll(ctx);
