import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import type { FilterProps } from './Filter.types'

export default function Filter(props: FilterProps) {
  const { placeHolder, filterItems, handleValueChange, rootClassName, value } =
    props
  return (
    <Select
      onValueChange={handleValueChange}
      value={value}
      disabled={props.isDisabled}
    >
      <SelectTrigger className={rootClassName}>
        <SelectValue placeholder={placeHolder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {filterItems.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
