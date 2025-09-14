import { getActiveBudgetByUserId } from "./getActiveBudgetByUserId"

export type ActiveBudgetByUserId = Awaited<ReturnType<typeof getActiveBudgetByUserId>>

export {
  getActiveBudgetByUserId,
}
