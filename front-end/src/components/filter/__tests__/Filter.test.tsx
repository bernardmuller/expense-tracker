import setupUserEvent from '@/lib/utils/testing/setupUserEvent'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import Filter from '../Filter'
import { generateFilterProps } from '../__mocks__/filterProps.mock'

describe('Filter', () => {
  describe('default state', () => {
    it('should render a placeholder', () => {
      const { filterItems, handleValueChange, placeHolder } =
        generateFilterProps({
          handleValueChange: vi.fn(),
        })
      render(
        <Filter
          placeHolder={placeHolder}
          filterItems={filterItems}
          handleValueChange={handleValueChange}
        />,
      )
      expect(screen.getByText(placeHolder)).toBeInTheDocument()
    })
    it('should display the correct amount of options', async () => {
      const { filterItems, handleValueChange, placeHolder } =
        generateFilterProps({
          handleValueChange: vi.fn(),
        })
      const { user } = setupUserEvent(
        <Filter
          placeHolder={placeHolder}
          filterItems={filterItems}
          handleValueChange={handleValueChange}
        />,
      )
      const selectButtonElement = screen.getByRole('combobox')
      await user.click(selectButtonElement)
      for (const item of filterItems) {
        expect(screen.getByText(item.name)).toBeInTheDocument()
      }
    })
    it('should call a function when the value is changed', async () => {
      const { filterItems, handleValueChange, placeHolder } =
        generateFilterProps({
          handleValueChange: vi.fn(),
        })
      const { user } = setupUserEvent(
        <Filter
          placeHolder={placeHolder}
          filterItems={filterItems}
          handleValueChange={handleValueChange}
        />,
      )
      const selectButtonElement = screen.getByRole('combobox')
      await user.click(selectButtonElement)
      const firstItem = screen.getByText(filterItems[0].name)
      await user.click(firstItem)
      expect(handleValueChange).toHaveBeenCalled()
    })
    it('should pass the new value into the function when an option is selected', async () => {
      const { filterItems, handleValueChange, placeHolder } =
        generateFilterProps({
          handleValueChange: vi.fn(),
        })
      const { user } = setupUserEvent(
        <Filter
          placeHolder={placeHolder}
          filterItems={filterItems}
          handleValueChange={handleValueChange}
        />,
      )
      const selectButtonElement = screen.getByRole('combobox')
      await user.click(selectButtonElement)
      const firstItem = screen.getByText(filterItems[0].name)
      await user.click(firstItem)
      expect(handleValueChange).toHaveBeenCalledWith(filterItems[0].value)
    })
  })
  describe('disabled state', () => {
    it('should not show options when clicked', () => {
      const { filterItems, placeHolder } = generateFilterProps()
      const { user } = setupUserEvent(
        <Filter
          placeHolder={placeHolder}
          filterItems={filterItems}
          handleValueChange={console.log}
          isDisabled
        />,
      )
      const selectButtonElement = screen.getByRole('combobox')
      user.click(selectButtonElement)
      const firstItem = screen.queryByText(filterItems[0].name)
      expect(firstItem).not.toBeInTheDocument()
    })
  })
})
