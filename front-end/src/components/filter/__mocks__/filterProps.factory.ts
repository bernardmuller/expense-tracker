import { faker } from '@faker-js/faker'
import type { FilterProps } from './../Filter.types'

const FILTER_PLACEHOLDER = 'Filter' as const
const filterItemsArray = faker.helpers.multiple(
  () => faker.finance.transactionType(),
  { count: 4 },
)
const filterItems = filterItemsArray.map((item) => {
  return { name: item, value: item.toLowerCase() }
})

export const filterProps: FilterProps = {
  placeHolder: FILTER_PLACEHOLDER,
  filterItems: filterItems,
  handleValueChange: (value) => {
    console.log(value)
  },
}
