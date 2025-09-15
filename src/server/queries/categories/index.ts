import { getAllCategoriesByUserId } from "./getAllCategoriesByUserId"

export type CategoriesByUserId = Awaited<ReturnType<typeof getAllCategoriesByUserId>>

export {
	getAllCategoriesByUserId,
}
