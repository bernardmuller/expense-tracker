import { addUserCategoryQuery } from "./addUserCategoryQuery"
import { createCategoryQuery } from "./createCategoryQuery"
import { deleteCategoryQuery } from "./deleteCategoryQuery"
import { getAllCategoriesByUserId } from "./getAllCategoriesByUserId"
import { getAllCategoriesQuery } from "./getAllCategoriesQuery"
import { getCategoryByKeyQuery } from "./getCategoryByKeyQuery"
import getCategoryExpensesByBudgetId from "./getCategoryExpensesByBudgetId"
import { getUserActiveCategoriesQuery } from "./getUserActiveCategoriesQuery"
import { removeUserCategoryQuery } from "./removeUserCategoryQuery"
import { setupDefaultUserCategoriesQuery } from "./setupDefaultUserCategoriesQuery"
import { updateCategoryQuery } from "./updateCategoryQuery"

export type AddUserCategoryResult = Awaited<ReturnType<typeof addUserCategoryQuery>>
export type CreateCategoryResult = Awaited<ReturnType<typeof createCategoryQuery>>
export type DeleteCategoryResult = Awaited<ReturnType<typeof deleteCategoryQuery>>
export type CategoriesByUserId = Awaited<ReturnType<typeof getAllCategoriesByUserId>>
export type AllCategories = Awaited<ReturnType<typeof getAllCategoriesQuery>>
export type CategoryByKey = Awaited<ReturnType<typeof getCategoryByKeyQuery>>
export type CategoryExpensesByBudgetId = Awaited<ReturnType<typeof getCategoryExpensesByBudgetId>>
export type UserActiveCategories = Awaited<ReturnType<typeof getUserActiveCategoriesQuery>>
export type RemoveUserCategoryResult = Awaited<ReturnType<typeof removeUserCategoryQuery>>
export type SetupDefaultUserCategoriesResult = Awaited<ReturnType<typeof setupDefaultUserCategoriesQuery>>
export type UpdateCategoryResult = Awaited<ReturnType<typeof updateCategoryQuery>>

export {
	addUserCategoryQuery,
	createCategoryQuery,
	deleteCategoryQuery,
	getAllCategoriesByUserId,
	getAllCategoriesQuery,
	getCategoryByKeyQuery,
	getCategoryExpensesByBudgetId,
	getUserActiveCategoriesQuery,
	removeUserCategoryQuery,
	setupDefaultUserCategoriesQuery,
	updateCategoryQuery,
}
