import { createSelectSchema } from "drizzle-zod";
import { expenses } from "@/lib/db/schema";

export const transactionSchema = createSelectSchema(expenses);
