export function calculateSpentPercentage(
  startAmount: number,
  spentAmount: number,
) {
  return startAmount > 0 ? (spentAmount / startAmount) * 100 : 0
}
