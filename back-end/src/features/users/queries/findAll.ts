import type { AppContext } from "@/lib/db/context";
import { users } from "@/lib/db/schema";
import type { User } from "../types";
import { AppResult, fromDB } from "@/lib/result";
import { DatabaseError } from "@/lib/errors/domain";

export const findAll = (ctx: AppContext): AppResult<User[], DatabaseError> =>
  fromDB(ctx.db.select().from(users));
