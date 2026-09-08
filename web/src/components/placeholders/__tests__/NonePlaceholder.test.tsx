import { render, screen } from '@testing-library/react'
import { NonePlaceholder } from '../NonePlaceholder'
import { generateNonePlaceholderProps } from '../__mocks__/NonePlaceholder.mock'

describe('NonePlaceholder', () => {
  const { headerEmoji, contentText, footerText } =
    generateNonePlaceholderProps()

  it('should render all props', () => {
    render(
      <NonePlaceholder
        headerEmoji={headerEmoji}
        contentText={contentText}
        footerText={footerText}
      />,
    )
    expect(screen.getByText(headerEmoji)).toBeInTheDocument()
    expect(screen.getByText(contentText)).toBeInTheDocument()
    expect(screen.getByText(footerText)).toBeInTheDocument()
  })
})
