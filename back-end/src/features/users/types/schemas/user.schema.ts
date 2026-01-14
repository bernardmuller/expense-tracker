import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "@/lib/db/schema";

export const userInsertSchema = createInsertSchema(users);
export const userSchema = createSelectSchema(users);
