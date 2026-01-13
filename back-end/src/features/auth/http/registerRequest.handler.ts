import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { registerRequest } from "../operations";

export const registerRequestHandler = async (c: Context) => {
  const body = await c.req.json<{
    name: string;
    email: string;
  }>();
  const ctx = createContext();
  const result = await registerRequest(body, ctx);

  return result.match(
    (token) => c.json({ token }, 200),
    (error) => mapErrorToResponse(error, c),
  );
};
