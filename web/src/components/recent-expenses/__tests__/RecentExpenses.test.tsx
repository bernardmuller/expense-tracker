import RecentExpenses from '../RecentExpenses'
import { render, screen } from '@testing-library/react'

describe('RecentExpenses', () => {
  it('should render the header text', () => {
    render(
      <RecentExpenses
        linkProvider={({ children }: { children: React.ReactNode }) => (
          <a href="/">{children}</a>
        )}
      >
        <div>Child Item</div>
      </RecentExpenses>,
    )
    expect(screen.getByText(/recent expenses/i)).toBeInTheDocument()
  })
  it('should render children', () => {
    render(
      <RecentExpenses
        linkProvider={({ children }: { children: React.ReactNode }) => (
          <a href="/">{children}</a>
        )}
      >
        <div>Child Item</div>
      </RecentExpenses>,
    )
    expect(screen.getByText(/Child Item/i)).toBeInTheDocument()
  })
  describe('Link Action', () => {
    it('should render view text', () => {
      render(
        <RecentExpenses
          linkProvider={({ children }: { children: React.ReactNode }) => (
            <a href="/">{children}</a>
          )}
        >
          <div>Child Item</div>
        </RecentExpenses>,
      )
      expect(screen.getByText(/view/i)).toBeInTheDocument()
    })
    it('should render a link', () => {
      render(
        <RecentExpenses
          linkProvider={({ children }: { children: React.ReactNode }) => (
            <a href="/">{children}</a>
          )}
        >
          <div>Child Item</div>
        </RecentExpenses>,
      )
      expect(screen.getByRole('link')).toBeInTheDocument()
    })
  })
})
