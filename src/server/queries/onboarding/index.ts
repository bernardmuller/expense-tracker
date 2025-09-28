import { completeOnboardingQuery } from "./completeOnboardingQuery"
import { createUserCategoriesQuery } from "./createUserCategoriesQuery"

export type CompleteOnboardingResult = Awaited<ReturnType<typeof completeOnboardingQuery>>
export type CreateUserCategoriesResult = Awaited<ReturnType<typeof createUserCategoriesQuery>>

export {
	completeOnboardingQuery,
	createUserCategoriesQuery,
}