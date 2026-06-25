import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { parseSearchQuery } from "@/lib/utils/parseSearchQuery";
import { getVerifications } from "../services";
import type { Verification } from "../types";

export const getVerificationsHandler = async (c: Context) => {
  return parseSearchQuery<
    Verification,
    {
      identifier: string;
      value: string;
    }
  >({
    rawQuery: c.req.query(),
    allowedSortKeys: ["createdAt"],
    filterKeys: ["identifier", "value"],
  })
    .asyncAndThen((search) => {
      const ctx = createContext();
      return getVerifications(search, ctx);
    })
    .match(
      (verifications) =>
        c.json({ verifications, count: verifications.length }, 200),
      (error) => mapErrorToResponse(error, c),
    );
};
