import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { loginRequest } from "../operations";

export const loginRequestHandler = async (c: Context) => {
  const body = await c.req.json<{
    email: string;
  }>();
  const ctx = createContext();
  const result = await loginRequest(body, ctx);

  return result.match(
    (token) => c.json({ token }, 200),
    (error) => mapErrorToResponse(error, c),
  );
};
