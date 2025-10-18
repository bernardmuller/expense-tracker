import type { FilterProps } from './../Filter.types'

const FILTER_PLACEHOLDER = 'Filter' as const
const EXPENSE_CATEGORIES = [
  'Housing',
  'Utilities',
  'Transportation',
  'Food',
  'Healthcare',
  'Personal',
  'Entertainment',
  'Debt Payments',
  'Savings & Investments',
  'Insurance',
  'Miscellaneous',
] as const

const filterItems = EXPENSE_CATEGORIES.map((item) => {
  return { name: item, value: item.toLowerCase() }
})

export const filterProps: FilterProps = {
  placeHolder: FILTER_PLACEHOLDER,
  filterItems: filterItems,
  handleValueChange: (_value) => {},
}
