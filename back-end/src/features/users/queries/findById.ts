import type { AppContext } from "@/lib/db/context";
import { users } from "@/lib/db/schema";
import {
  EntityNotFoundError,
  EntityReadError,
} from "@/lib/errors/actionErrors";
import { eq } from "drizzle-orm";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import type { User } from "../types";

export const findById = (
  id: string,
  ctx: AppContext,
): ResultAsync<
  User,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
> =>
  ResultAsync.fromPromise(
    ctx.db.select().from(users).where(eq(users.id, id)),
    (error) => new EntityReadError("User", String(error)),
  ).andThen(([user]) =>
    user ? okAsync(user) : errAsync(new EntityNotFoundError(`User: ${id}`)),
  );
