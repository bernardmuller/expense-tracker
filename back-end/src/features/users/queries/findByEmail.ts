import type { AppContext } from "@/lib/db/context";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { User } from "../types";
import { AppResult, fromDB, success, failure } from "@/lib/result";
import { NotFoundError, DatabaseError } from "@/lib/errors/domain";

export const findByEmail = (
  email: string,
  ctx: AppContext,
): AppResult<User, NotFoundError | DatabaseError> =>
  fromDB(ctx.db.select().from(users).where(eq(users.email, email))).andThen(
    ([user]) => (user ? success(user) : failure(new NotFoundError(email))),
  );
