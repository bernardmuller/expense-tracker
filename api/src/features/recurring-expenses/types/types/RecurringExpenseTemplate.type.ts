import z from "zod";
import {
  recurringExpenseTemplateSchema,
  createTemplateSchema,
  updateTemplateSchema,
} from "../schemas";

export type RecurringExpenseTemplate = z.infer<
  typeof recurringExpenseTemplateSchema
>;
export type CreateTemplateParams = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateParams = z.infer<typeof updateTemplateSchema>;
