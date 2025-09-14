import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { vi } from 'vitest'

// Mock the Link component from TanStack Router
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, ...props }: any) => <a {...props}>{children}</a>
}))

const customRender = (
  ui: React.ReactElement,
  options?: RenderOptions
) => render(ui, options)

export * from '@testing-library/react'
export { customRender as render }