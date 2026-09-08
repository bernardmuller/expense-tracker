import { createInsertSchema } from "drizzle-zod";
import { expenses } from "@/lib/db/schema";

export const transactionInsertSchema = createInsertSchema(expenses);
