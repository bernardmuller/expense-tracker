import z from "zod";
import { onboardingSchema } from "../schemas";

export type OnboardingParams = z.infer<typeof onboardingSchema>;
