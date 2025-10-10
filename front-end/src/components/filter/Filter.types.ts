export type FilterItems = string[]

export type FilterProps<T extends FilterItems> = {
    filterItems: T,
    placeHolder: string,
    defaultOption: T[number]
}
