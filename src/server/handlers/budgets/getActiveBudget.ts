import type { ActiveBudgetByUserId } from "@/server/queries/budgets/getActiveBudgetByUserId";
import { getActiveBudgetByUserId } from "@/server/queries/budgets/getActiveBudgetByUserId";

function extract({ activeBudget }: {
	activeBudget: ActiveBudgetByUserId
}) {
	return {
		activeBudget
	}
}

export default async function getActiveBudgetHandler(userId: string) {
	const activeBudget = await getActiveBudgetByUserId(userId)
	const data = extract({
		activeBudget
	})
	return data
}

export type ActiveBudgetByUserId = Awaited<ReturnType<typeof extract>>
