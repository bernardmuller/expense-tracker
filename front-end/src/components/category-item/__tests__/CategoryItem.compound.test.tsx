import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import * as CategoryItem from '../CategoryItem.compound'

describe('CategoryItem.Root', () => {
  it('renders children', () => {
    render(<CategoryItem.Root>Test Content</CategoryItem.Root>)
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })
  it('applies cursor-pointer class', () => {
    const { container } = render(<CategoryItem.Root>Content</CategoryItem.Root>)
    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass('cursor-pointer')
  })
  it('merges custom className', () => {
    const { container } = render(
      <CategoryItem.Root className="custom-class">Content</CategoryItem.Root>,
    )
    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass('cursor-pointer', 'custom-class')
  })
})

describe('CategoryItem.Content', () => {
  it('renders children', () => {
    render(<CategoryItem.Content>Test Content</CategoryItem.Content>)
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })
  it('applies flex layout classes', () => {
    const { container } = render(
      <CategoryItem.Content>Content</CategoryItem.Content>,
    )
    const content = container.querySelector('div')
    expect(content).toHaveClass('flex', 'items-center', 'gap-3')
  })
})

describe('CategoryItem.IconName', () => {
  it('renders icon and name', () => {
    render(<CategoryItem.IconName icon="🛒" name="Groceries" />)
    expect(screen.getByText('🛒')).toBeInTheDocument()
    expect(screen.getByText('Groceries')).toBeInTheDocument()
  })
  it('applies layout classes', () => {
    const { container } = render(
      <CategoryItem.IconName icon="🛒" name="Groceries" />,
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('flex', 'flex-1', 'items-center', 'gap-2')
  })
})
