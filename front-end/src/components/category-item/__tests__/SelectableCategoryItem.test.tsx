import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { createSelectableCategoryItemProps } from '../__mocks__/categoryItemProps.factory'
import SelectableCategoryItem from '../SelectableCategoryItem'

describe('SelectableCategoryItem', () => {
  it('renders category icon and name', () => {
    const props = createSelectableCategoryItemProps()
    render(<SelectableCategoryItem {...props} />)

    expect(screen.getByText(props.icon)).toBeInTheDocument()
    expect(screen.getByText(props.name)).toBeInTheDocument()
  })

  it('renders unchecked checkbox by default', () => {
    const props = createSelectableCategoryItemProps({ checked: false })
    render(<SelectableCategoryItem {...props} />)

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
  })

  it('renders checked checkbox when checked prop is true', () => {
    const props = createSelectableCategoryItemProps({ checked: true })
    render(<SelectableCategoryItem {...props} />)

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  it('applies border-primary class when checked', () => {
    const props = createSelectableCategoryItemProps({
      checked: true,
      id: 'test',
    })
    render(<SelectableCategoryItem {...props} />)

    const card = screen.getByTestId('selectable-category-test')
    expect(card).toHaveClass('border-primary')
  })

  it('does not apply border-primary class when unchecked', () => {
    const props = createSelectableCategoryItemProps({
      checked: false,
      id: 'test',
    })
    render(<SelectableCategoryItem {...props} />)

    const card = screen.getByTestId('selectable-category-test')
    expect(card).not.toHaveClass('border-primary')
  })

  it('calls onCheckedChange when checkbox is clicked', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    const props = createSelectableCategoryItemProps({ onCheckedChange })

    render(<SelectableCategoryItem {...props} />)

    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)

    expect(onCheckedChange).toHaveBeenCalledTimes(1)
  })
})
