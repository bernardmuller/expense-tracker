import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { refreshTokens } from "../operations";
import { MissingAuthorizationHeaderError, InvalidAuthorizationHeaderError } from "../types";

export const refreshHandler = async (c: Context) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader) {
    const error = new MissingAuthorizationHeaderError();
    return mapErrorToResponse(error, c);
  }

  if (!authHeader.startsWith("Bearer ")) {
    const error = new InvalidAuthorizationHeaderError();
    return mapErrorToResponse(error, c);
  }

  const refreshToken = authHeader.substring(7);
  if (!refreshToken) {
    const error = new InvalidAuthorizationHeaderError();
    return mapErrorToResponse(error, c);
  }

  const ctx = createContext();
  const result = await refreshTokens(refreshToken, ctx);

  return result.match(
    (tokens) => c.json(tokens, 200),
    (error) => mapErrorToResponse(error, c),
  );
};
