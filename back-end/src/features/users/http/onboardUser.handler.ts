import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { onboardUser } from "../operations";
import { onboardingSchema } from "../types";

export const onboardUserHandler = async (c: Context) => {
  const user = c.get("user") as { userId: string };
  const json = await c.req.json();
  // Validate and coerce types (e.g. string -> Date)
  const body = onboardingSchema.parse(json);
  const ctx = createContext();
  const result = await onboardUser(user.userId, body, ctx);

  return result.match(
    (user) => c.json(user, 200),
    (error) => mapErrorToResponse(error, c),
  );
};
