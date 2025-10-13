import { faker } from "@faker-js/faker";
import type { FilterProps } from "./Filter.types";

export const FILTER_PLACEHOLDER = "Filter" as const
export const filterItems = faker.helpers.multiple(() => faker.finance.transactionType(), { count: 10 })

export const filterProps: FilterProps = {
  placeHolder: FILTER_PLACEHOLDER,
  filterItems: filterItems,
  defaultOption: filterItems[0],
  handleValueChange: (value) => {console.log(value)}
}
