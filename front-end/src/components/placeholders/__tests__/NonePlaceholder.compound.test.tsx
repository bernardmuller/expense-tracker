import { render, screen } from '@testing-library/react'
import { BoldText, MutedText, Root, Emoji } from '../NonePlaceholder.compound'

describe('NonePlaceholderCompound', () => {
  describe('NonePlaceholderCompound.Root', () => {
    it('should render children', () => {
      render(
        <Root>
          <div>Children content</div>
        </Root>,
      )
      expect(screen.getByText('Children content')).toBeInTheDocument()
    })
  })
  describe('NonePlaceholderCompound.Emoji', () => {
    it('should render an emoji', () => {
      render(<Emoji emoji={'📖'} />)
      expect(screen.getByText('📖')).toBeInTheDocument()
    })
  })
  describe('NonePlaceHolder.BoldText', () => {
    it('should render text', () => {
      render(<BoldText text={'No Expenses Yet'} />)
      expect(screen.getByText('No Expenses Yet')).toBeInTheDocument()
    })
  })
  describe('NonePlaceHolder.MutedText', () => {
    it('should render text', () => {
      render(
        <MutedText
          text={'Start adding expenses to see your budget breakdown.'}
        />,
      )
      expect(
        screen.getByText('Start adding expenses to see your budget breakdown.'),
      ).toBeInTheDocument()
    })
  })
})
