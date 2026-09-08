import { validateEmail } from "@/lib/validations/emailValidator";
import { validateName } from "@/lib/validations/nameValidator";
import { userInsertSchema } from "./user.schema";

export const registerRequestSchema = userInsertSchema
  .pick({
    name: true,
    email: true,
  })
  .refine((val) => validateEmail(val.email), {
    message: "Invalid email",
    path: ["email"],
  })
  .refine((val) => validateName(val.name), {
    message: "Invalid name",
    path: ["name"],
  });
