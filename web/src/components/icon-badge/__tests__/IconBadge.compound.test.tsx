import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import * as IconBadge from '../IconBadge.compound'

describe('IconBadge.Root', () => {
  it('renders children', () => {
    render(<IconBadge.Root>Test Content</IconBadge.Root>)
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('merges custom className', () => {
    const { container } = render(
      <IconBadge.Root className="custom-class">Content</IconBadge.Root>,
    )
    const root = container.firstChild as HTMLElement
    expect(root).toHaveClass('rounded-full', 'custom-class')
  })
})

describe('IconBadge.Icon', () => {
  it('renders children', () => {
    render(<IconBadge.Icon>Icon</IconBadge.Icon>)
    expect(screen.getByText('Icon')).toBeInTheDocument()
  })
})
