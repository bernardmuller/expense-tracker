import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { updateVerification } from "../services";

export const updateVerificationHandler = async (c: Context) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const ctx = createContext();
  const result = await updateVerification(id, body, ctx);

  return result.match(
    (verification) => c.json({ verification }, 200),
    (error) => mapErrorToResponse(error, c),
  );
};
