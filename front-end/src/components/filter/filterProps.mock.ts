import type { FilterProps } from "./Filter.types"
import { filterProps } from "./filterProps.factory"

export const generateFilterProps = (
  overwrites: Partial<FilterProps> = {},
) => ({
  ...filterProps,
  ...overwrites
})
