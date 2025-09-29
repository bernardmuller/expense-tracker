import { formatCurrency } from "./formatCurrency"

type VisibleCurrencyParams = {
  currency: string
  isVisible: boolean
  amount: number
}

export function getVisibleCurrency({
  currency,
  isVisible,
  amount
}: VisibleCurrencyParams) {
  if (!currency) throw new Error("getVisibleCurrency: no currency provided")
  return isVisible ? `${currency}${formatCurrency(amount)}` : `${currency}********`
}
