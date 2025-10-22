import { vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import Filter from '../Filter'
import { generateFilterProps } from '../__mocks__/filterProps.mock'

describe('Filter', () => {
  describe('default state', () => {
    const { filterItems, handleValueChange, placeHolder } = generateFilterProps(
      {
        handleValueChange: vi.fn(),
      },
    )
    beforeEach(() => {
      render(
        <Filter
          placeHolder={placeHolder}
          filterItems={filterItems}
          handleValueChange={handleValueChange}
        />,
      )
    })

    it('should render a placeholder', () => {
      expect(screen.getByText(placeHolder)).toBeInTheDocument()
    })
    it('should display the correct amount of options', async () => {
      const selectButtonElement = screen.getByRole('combobox')
      fireEvent.click(selectButtonElement)
      for (const item of filterItems) {
        expect(screen.getByText(item.name)).toBeInTheDocument()
      }
    })
    it('should call a function when the value is changed', () => {
      const selectButtonElement = screen.getByRole('combobox')
      fireEvent.click(selectButtonElement)
      const firstItem = screen.getByText(filterItems[0].name)
      fireEvent.click(firstItem)
      expect(handleValueChange).toHaveBeenCalled()
    })
    it('should pass the new value into the function when an option is selected', () => {
      const selectButtonElement = screen.getByRole('combobox')
      fireEvent.click(selectButtonElement)
      const firstItem = screen.getByText(filterItems[0].name)
      fireEvent.click(firstItem)
      expect(handleValueChange).toHaveBeenCalledWith(filterItems[0].value)
    })
  })
  describe('disabled state', () => {
    const { filterItems, placeHolder } = generateFilterProps()
    it('should not show options when clicked', () => {
      render(
        <Filter
          placeHolder={placeHolder}
          filterItems={filterItems}
          handleValueChange={console.log}
          isDisabled
        />,
      )
      const selectButtonElement = screen.getByRole('combobox')
      fireEvent.click(selectButtonElement)
      const firstItem = screen.queryByText(filterItems[0].name)
      expect(firstItem).not.toBeInTheDocument()
    })
  })
})
