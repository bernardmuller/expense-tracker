import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { deleteVerification } from "../services";

export const deleteVerificationHandler = async (c: Context) => {
  const id = c.req.param("id");
  const ctx = createContext();
  const result = await deleteVerification(id, ctx);

  return result.match(
    (verification) => c.json({ verification }, 200),
    (error) => mapErrorToResponse(error, c),
  );
};
