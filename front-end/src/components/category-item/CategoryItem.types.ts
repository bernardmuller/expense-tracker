export type CategoryItemProps = {
  icon: string
  label: string
  id: string
}

export type SelectableCategoryItemProps = CategoryItemProps & {
  checked: boolean
  onCheckedChange: () => void
}

export type AllocatableCategoryItemProps = CategoryItemProps & {
  amount: number
  onAmountChange: (amount: number) => void
}
