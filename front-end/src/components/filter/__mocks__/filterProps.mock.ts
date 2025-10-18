import { filterProps } from './filterProps.factory'
import type { FilterProps } from './../Filter.types'

export const generateFilterProps = (overwrites: Partial<FilterProps> = {}) => ({
  ...filterProps,
  ...overwrites,
})
