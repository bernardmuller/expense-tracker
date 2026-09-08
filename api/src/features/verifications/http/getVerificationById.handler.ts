import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { getVerificationById } from "../services";

export const getVerificationByIdHandler = async (c: Context) => {
  const id = c.req.param("id");
  const ctx = createContext();
  const result = await getVerificationById(id, ctx);

  return result.match(
    (verification) => c.json({ verification }, 200),
    (error) => mapErrorToResponse(error, c),
  );
};
