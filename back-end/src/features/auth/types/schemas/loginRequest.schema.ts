import { validateEmail } from "@/lib/validations/emailValidator";
import { userInsertSchema } from "./user.schema";

export const loginRequestSchema = userInsertSchema
  .pick({
    email: true,
  })
  .refine((val) => validateEmail(val.email), {
    message: "Invalid email",
    path: ["email"],
  });
