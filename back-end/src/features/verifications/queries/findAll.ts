import type { AppContext } from "@/lib/db/context";
import { verifications } from "@/lib/db/schema";
import type { Verification } from "../types";
import { AppResult, fromDB } from "@/lib/result";
import { DatabaseError } from "@/lib/errors/domain";

export const findAll = (ctx: AppContext): AppResult<Verification[], DatabaseError> =>
  fromDB(ctx.db.select().from(verifications));
