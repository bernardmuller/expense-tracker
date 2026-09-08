import z from "zod";
import { userSelectSchema } from "./user.schema";

export const registerVerifyResponseSchema = z.object({
  user: userSelectSchema,
  accessToken: z.jwt(),
  refreshToken: z.jwt(),
});
