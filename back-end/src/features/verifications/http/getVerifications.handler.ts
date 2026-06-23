import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { getVerifications } from "../services";

export const getVerificationsHandler = async (c: Context) => {
  const ctx = createContext();
  const result = await getVerifications(ctx);

  return result.match(
    (verifications) => c.json({ verifications, count: verifications.length }, 200),
    (error) => mapErrorToResponse(error, c),
  );
};
