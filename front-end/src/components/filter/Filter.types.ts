import type { HTMLProps } from 'react'

export type FilterProps = {
  filterItems: {
    name: string
    value: string
  }[]
  placeHolder: string
  handleValueChange: (value: string) => void
  rootClassName?: HTMLProps<HTMLElement>['className']
}
