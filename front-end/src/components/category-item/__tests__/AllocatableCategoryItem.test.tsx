import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCategoryItemProps } from '../__mocks__/categoryItemProps.factory'
import AllocatableCategoryItem from '../AllocatableCategoryItem'

describe('AllocatableCategoryItem', () => {
  it('renders category icon and name', () => {
    const props = createCategoryItemProps()
    render(
      <AllocatableCategoryItem {...props}>
        <input type="number" />
      </AllocatableCategoryItem>,
    )
    expect(screen.getByText(props.icon)).toBeInTheDocument()
    expect(screen.getByText(props.name)).toBeInTheDocument()
  })
  it('renders children in the input area', () => {
    const props = createCategoryItemProps()
    render(
      <AllocatableCategoryItem {...props}>
        <input type="number" placeholder="Amount" />
      </AllocatableCategoryItem>,
    )
    expect(screen.getByPlaceholderText('Amount')).toBeInTheDocument()
  })
  it('renders testid with category id', () => {
    const props = createCategoryItemProps({ id: 'test-category' })
    render(
      <AllocatableCategoryItem {...props}>
        <input type="number" />
      </AllocatableCategoryItem>,
    )
    expect(
      screen.getByTestId('allocatable-category-test-category'),
    ).toBeInTheDocument()
  })
  it('applies w-36 class to children wrapper', () => {
    const props = createCategoryItemProps()
    render(
      <AllocatableCategoryItem {...props}>
        <input type="number" data-testid="input" />
      </AllocatableCategoryItem>,
    )
    const input = screen.getByTestId('input')
    const wrapper = input.parentElement
    expect(wrapper).toHaveClass('w-36')
  })
})
