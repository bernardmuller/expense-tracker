import { createSelectSchema } from "drizzle-zod";
import { categories } from "@/lib/db/schema";

export const categorySchema = createSelectSchema(categories);
export const categoryWithoutMetadataSchema = categorySchema.pick({
  id: true,
  key: true,
  label: true,
  icon: true,
});
