import type { ResultAsync } from "neverthrow";
import type { AppContext } from "@/lib/db/context";
import * as UserQueries from "../queries";
import type { User } from "../types";
import { EntityReadError } from "@/lib/errors/actionErrors";

export const getAllUsers = (
  ctx: AppContext,
): ResultAsync<User[], InstanceType<typeof EntityReadError>> =>
  UserQueries.findAll(ctx);
