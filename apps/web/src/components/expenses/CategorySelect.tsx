import { ChevronDownIcon } from 'lucide-react'
import ReactSelect from 'react-select'
import type { StylesConfig } from 'react-select';

export type CategoryOption = {
  value: string
  label: string
}

type CategorySelectProps = {
  options: Array<CategoryOption>;
  value?: CategoryOption;
  onChange: (val: string) => void;
  isLoading: boolean;
  isDisabled: boolean;
}

const customStyles: StylesConfig<CategoryOption, false> = {
  control: (provided, state) => ({
    ...provided,
    minHeight: '40px',
    border: '1px solid rgb(35 35 35);', // --border equivalent
    borderRadius: '6px',
    backgroundColor: 'rgb(28, 28, 28)', // light background to match inputs
    boxShadow: state.isFocused
      ? '0 0 0 2px rgba(255, 230, 143, 0.7)' // yellowish ring color to match other inputs
      : '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    borderColor: state.isFocused ? 'rgb(234 179 8)' : '', // yellow : --border
    '&:hover': {
      borderColor: state.isFocused ? 'rgb(234 179 8)' : '',
    },
    borderWidth: "1px",
    transition: 'color, box-shadow',
    outline: 'none',
    cursor: 'pointer',
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: '0 12px',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'rgb(113 113 122)', // --muted-foreground equivalent
    fontSize: '16px', // match input text size
    '@media (min-width: 768px)': {
      fontSize: '14px',
    },
    opacity: 1,
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'rgb(255 255 255)', // --foreground equivalent
    fontSize: '16px', // match input text size
    '@media (min-width: 768px)': {
      fontSize: '14px',
    },
  }),
  input: (provided) => ({
    ...provided,
    color: 'rgb(255 255 255)', // --foreground equivalent
    fontSize: '16px', // match input text size
    '@media (min-width: 768px)': {
      fontSize: '14px',
    },
    backgroundColor: '', // --popover equivalent
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: 'rgb(228 228 231)', // --popover equivalent
    border: '1px solid oklch(0.3132 0 0)', // --border equivalent
    borderRadius: '0px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    zIndex: 50,
  }),
  menuList: (provided) => ({
    ...provided,
    padding: '4px',
    backgroundColor: 'oklch(0.1822 0 0)', // --popover equivalent
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused
      ? 'oklch(0.2393 0 0)' // --accent equivalent
      : '', // --popover equivalent
    color: state.isFocused
      ? 'rgb(255 255 255)' // --accent-foreground equivalent
      : 'rgb(255 255 255)', // --popover-foreground equivalent
    borderRadius: '4px',
    padding: '6px 8px',
    margin: '0',
    fontSize: '16px',
    gap: '4px',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: 'rgb(244 244 245)', // --accent equivalent
    },
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: 'rgb(113 113 122)', // --muted-foreground equivalent
    padding: '8px',
    '&:hover': {
      color: 'rgb(113 113 122)',
    },
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
}

export default function CategorySelect({
  options,
  value,
  onChange,
  isLoading,
  isDisabled,
}: CategorySelectProps) {
  return (
    <ReactSelect<CategoryOption>
      options={options}
      value={value}
      onChange={(option) => onChange(option ? option.value : '')}
      placeholder={isLoading ? "Loading categories..." : "Category"}
      isLoading={isLoading}
      // isDisabled={mutation.isPending || categoriesLoading}
      isDisabled={isDisabled}
      styles={customStyles}
      components={{
        DropdownIndicator: ({ ...props }) => (
          <>
            {/* @ts-ignore: I have no idea what this style does tbh */}
            < div {...props.innerProps} style={props.getStyles('dropdownIndicator', props)}>
              <ChevronDownIcon className="size-4 opacity-50" />
            </div>
          </>
        ),
      }}
      isClearable={false}
      isSearchable={true}
    />
  )
}
