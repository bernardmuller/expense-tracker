import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils/cn'
import * as CategoryItem from './CategoryItem.compound'
import type { SelectableCategoryItemProps } from './CategoryItem.types'

export default function SelectableCategoryItem({
  icon,
  label,
  id,
  checked,
  onCheckedChange,
}: SelectableCategoryItemProps) {
  return (
    <label>
      <CategoryItem.Root
        className={cn({ 'border-primary': checked })}
        data-testid={`selectable-category-${id}`}
      >
        <CategoryItem.Content>
          <CategoryItem.IconName icon={icon} name={label} />
          <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
        </CategoryItem.Content>
      </CategoryItem.Root>
    </label>
  )
}
