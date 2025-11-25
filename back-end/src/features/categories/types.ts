import { createSelectSchema } from "drizzle-zod";
import { categories } from "@/lib/db/schema";
import z from "zod";

// Schema
export const categorySchema = createSelectSchema(categories);
export const categoryWithoutMetadataSchema = categorySchema.pick({
  id: true,
  key: true,
  label: true,
  icon: true,
});
// Types
export type Category = z.infer<typeof categorySchema>;
export type CategoryWithoutMetadata = z.infer<
  typeof categoryWithoutMetadataSchema
>;
