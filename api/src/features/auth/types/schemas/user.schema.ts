import { accounts, users } from "@/lib/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const userInsertSchema = createInsertSchema(users);
export const userSelectSchema = createSelectSchema(users);
export const accountInsertSchema = createInsertSchema(accounts);
