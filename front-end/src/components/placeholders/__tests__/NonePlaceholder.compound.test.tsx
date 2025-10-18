import { render, screen } from '@testing-library/react'
import { Root, Header, Content, Footer } from '../NonePlaceholder.compound'

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
  describe('NonePlaceholderCompound.Header', () => {
    it('should render an emoji', () => {
      render(<Header emoji={'📖'} />)
      expect(screen.getByText('📖')).toBeInTheDocument()
    })
  })
  describe('NonePlaceHolder.Content', () => {
    it('should render text', () => {
      render(<Content text={'No Expenses Yet'} />)
      expect(screen.getByText('No Expenses Yet')).toBeInTheDocument()
    })
  })
  describe('NonePlaceHolder.Footer', () => {
    it('should render text', () => {
      render(
        <Footer text={'Start adding expenses to see your budget breakdown.'} />,
      )
      expect(
        screen.getByText('Start adding expenses to see your budget breakdown.'),
      ).toBeInTheDocument()
    })
  })
})
