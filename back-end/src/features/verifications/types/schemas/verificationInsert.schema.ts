import { createInsertSchema } from "drizzle-zod";
import { verifications } from "@/lib/db/schema";

export const verificationInsertSchema = createInsertSchema(verifications);
