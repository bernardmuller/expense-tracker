import { expenses } from "@/lib/db/schema";
import { createSelectSchema } from "drizzle-zod";

export const transactionSchema = createSelectSchema(expenses);
