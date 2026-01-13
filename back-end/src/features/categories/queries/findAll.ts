import type { AppContext } from "@/lib/db/context";
import { EntityReadError } from "@/lib/errors/actionErrors";
import { ResultAsync } from "neverthrow";
import type { CategoryWithoutMetadata } from "../types";
import { getCategories } from "./getCategories";

// Alias for backwards compatibility
export const findAll = (
  ctx: AppContext,
): ResultAsync<
  Array<CategoryWithoutMetadata>,
  InstanceType<typeof EntityReadError>
> => getCategories({}, ctx);
