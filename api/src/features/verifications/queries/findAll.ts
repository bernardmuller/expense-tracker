import type { AppContext } from "@/lib/db/context";
import { verifications } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { Verification } from "../types";
import { SearchQueries } from "@/lib/http/types";
import buildDrizzleQuery from "@/lib/utils/buildDrizzleQuery";
import { AppResult, fromDB } from "@/lib/result";
import { DatabaseError } from "@/lib/errors/domain";

export const findAll = (
  search: SearchQueries<
    Verification,
    {
      identifier: string;
      value: string;
    }
  >,
  ctx: AppContext,
): AppResult<Verification[], DatabaseError> => {
  const queryBuilder = ctx.db.select().from(verifications);

  return fromDB(
    buildDrizzleQuery(
      queryBuilder,
      search,
      {
        identifier: (value) => eq(verifications.identifier, value),
        value: (value) => eq(verifications.value, value),
      },
      {
        createdAt: verifications.createdAt,
      },
    ),
  );
};
