import type { ResultAsync } from "neverthrow";
import type { AppContext } from "@/lib/db/context";
import * as UserQueries from "../queries";
import type { User } from "../types";
import {
  EntityNotFoundError,
  EntityReadError,
} from "@/lib/errors/actionErrors";

export const getUserByEmail = (
  email: string,
  ctx: AppContext,
): ResultAsync<
  User,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
> => UserQueries.findByEmail(email, ctx);
