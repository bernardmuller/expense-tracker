import { and, desc, eq, isNull } from "drizzle-orm"
import { db } from "@/db";
import { expenses } from "@/db/schema";

export async function getRecentExpensesByBudgetId(id: number) {
	return await db
		.select()
		.from(expenses)
		.where(and(
			isNull(expenses.deletedAt),
			eq(expenses.budgetId, id)
		))
		.orderBy(desc(expenses.createdAt))
		.limit(5)

}
