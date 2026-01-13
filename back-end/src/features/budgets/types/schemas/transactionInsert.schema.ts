import { expenses } from "@/lib/db/schema";
import { createInsertSchema } from "drizzle-zod";

export const transactionInsertSchema = createInsertSchema(expenses);
