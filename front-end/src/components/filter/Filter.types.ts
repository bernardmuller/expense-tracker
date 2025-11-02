import type { HTMLProps } from 'react'

export type FilterItems = Array<{
  name: string
  value: string
}>

export type FilterProps = {
  filterItems: FilterItems
  placeHolder: string
  handleValueChange: (value: string) => void
  rootClassName?: HTMLProps<HTMLElement>['className']
  isDisabled?: boolean
}
