import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { getUserCategories } from "../services";

export const getUserCategoriesHandler = async (c: Context) => {
  const user = c.get("user") as { userId: string };
  const ctx = createContext();
  const result = await getUserCategories(user.userId, ctx);

  return result.match(
    (categories) => c.json(categories, 200),
    (error) => mapErrorToResponse(error, c),
  );
};
