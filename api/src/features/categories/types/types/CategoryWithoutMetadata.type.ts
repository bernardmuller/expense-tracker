import z from "zod";
import { categoryWithoutMetadataSchema } from "../schemas";

export type CategoryWithoutMetadata = z.infer<
  typeof categoryWithoutMetadataSchema
>;
