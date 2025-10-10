import { screen } from '@testing-library/react'
import Filter from './Filter'

describe('Filter', () => {
  const options: string[] = ['']

  render(<Filter />)
  it('should render a placeholder', () => {
    expect(screen.getByPlaceholderText('placeholder')).toBeInTheDocument()
  })
  it('should render all of the options', () => {
    for (const option of options) {
      expect(screen.getByRole('option', { name: option })).toBeInTheDocument()
    }
  })
  it('should display the correct amount of options', () => {
    expect(screen.getAllByRole('option').length).toBe(0)
  })
})
