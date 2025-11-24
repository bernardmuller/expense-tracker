import type { ReactNode } from 'react'
import * as CategoryItem from './CategoryItem.compound'
import type { CategoryItemProps } from './CategoryItem.types'

type AllocatableCategoryItemProps = CategoryItemProps & {
  children: ReactNode
}

export default function AllocatableCategoryItem({
  icon,
  name,
  id,
  children,
}: AllocatableCategoryItemProps) {
  return (
    <CategoryItem.Root data-testid={`allocatable-category-${id}`}>
      <CategoryItem.Content>
        <CategoryItem.IconName icon={icon} name={name} />
        <div className="">{children}</div>
      </CategoryItem.Content>
    </CategoryItem.Root>
  )
}
