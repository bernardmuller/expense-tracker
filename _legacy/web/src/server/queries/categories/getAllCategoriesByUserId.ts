import { and, eq, isNull } from 'drizzle-orm'
import { db } from "@/db";
import { categories, userCategories } from "@/db/schema";

export async function getAllCategoriesByUserId(id: string) {
	const result = await db
		.select({
			id: userCategories.id,
			key: categories.key,
			label: categories.label,
			icon: categories.icon,
			userId: userCategories.userId,
			categoryId: userCategories.categoryId,
			createdAt: userCategories.createdAt,
			updatedAt: userCategories.updatedAt,
			deletedAt: userCategories.deletedAt,
			category: categories
		})
		.from(userCategories)
		.innerJoin(categories, eq(userCategories.categoryId, categories.id))
		.where(
			and(
				eq(userCategories.userId, id),
				isNull(userCategories.deletedAt),
				isNull(categories.deletedAt)
			)
		)
		.orderBy(categories.label);

	return result;

}
