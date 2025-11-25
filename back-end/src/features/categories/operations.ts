import { type ResultAsync } from "neverthrow";
import type { AppContext } from "@/lib/db/context";
import * as CategoryQueries from "./queries";
import type { Category } from "./types";
import { EntityReadError } from "@/lib/errors/actionErrors";

export const getAllCategories = (
  ctx: AppContext,
): ResultAsync<Category[], InstanceType<typeof EntityReadError>> =>
  CategoryQueries.findAll(ctx);
