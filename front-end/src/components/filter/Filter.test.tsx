import { vi } from 'vitest'
import { screen, render } from '@testing-library/react'
import Filter from './Filter'
import { generateFilterProps } from './filterProps.mock'

describe('Filter', () => {
  const { defaultOption, filterItems, handleValueChange, placeHolder } =
    generateFilterProps()

  class MockPointerEvent extends Event {
    button: number
    ctrlKey: boolean
    pointerType: string

    constructor(type: string, props: PointerEventInit) {
      super(type, props)
      this.button = props.button || 0
      this.ctrlKey = props.ctrlKey || false
      this.pointerType = props.pointerType || 'mouse'
    }
  }

  window.PointerEvent = MockPointerEvent as any
  window.HTMLElement.prototype.scrollIntoView = vi.fn()
  window.HTMLElement.prototype.releasePointerCapture = vi.fn()
  window.HTMLElement.prototype.hasPointerCapture = vi.fn()

  beforeEach(() => {
    render(
      <Filter
        placeHolder={placeHolder}
        filterItems={filterItems}
        defaultOption={defaultOption}
        handleValueChange={handleValueChange}
      />,
    )
  })

  it('should render a placeholder', () => {
    expect(screen.getByPlaceholderText('placeholder')).toBeInTheDocument()
  })
  it('should render all of the options', () => {
    for (const item of filterItems) {
      expect(screen.getByRole('option', { name: item })).toBeInTheDocument()
    }
  })
  it('should display the correct amount of options', () => {
    expect(screen.getAllByRole('option').length).toBe(0)
  })
})
