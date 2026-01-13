import { createSelectSchema } from "drizzle-zod";
import { verifications } from "@/lib/db/schema";

export const verificationSchema = createSelectSchema(verifications);
