import { render, screen } from '@testing-library/react'
import * as NonePlaceholderCompound from '../NonePlaceholder.compound'

describe('NonePlaceholderCompound', () => {
  describe('NonePlaceholderCompound.Header', () => {
    it('should render an emoji', () => {
      render(<NonePlaceholderCompound.Header emoji={'📖'} />)
      expect(screen.getByText('📖')).toBeInTheDocument()
    })
  })
  describe('NonePlaceHolder.Content', () => {
    it('should render text', () => {
      render(<NonePlaceholderCompound.Content text={'No Expenses Yet'} />)
      expect(screen.getByText('No Expenses Yet')).toBeInTheDocument()
    })
  })
  describe('NonePlaceHolder.Footer', () => {
    it('should render text', () => {
      render(
        <NonePlaceholderCompound.Footer
          text={'Start adding expenses to see your budget breakdown.'}
        />,
      )
      expect(
        screen.getByText('Start adding expenses to see your budget breakdown.'),
      ).toBeInTheDocument()
    })
  })
})
