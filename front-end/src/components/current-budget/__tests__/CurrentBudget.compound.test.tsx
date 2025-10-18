import { act, fireEvent, render, screen } from '@testing-library/react'
import {
  Content,
  CurrentAmount,
  Footer,
  Header,
  HideTrigger,
  RemainingAmount,
  Root,
  SpentAmount,
  SpentPercentage,
  Title,
  ViewTrigger,
} from '../CurrentBudget.compound'

import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { useMemo } from 'react'

describe('CurrentBudgetCompound', () => {
  describe('Root', () => {
    it('should render children', () => {
      render(
        <Root>
          <div>Children content</div>
        </Root>,
      )
      expect(screen.getByText('Children content')).toBeInTheDocument()
    })
  })
  describe('Header', () => {
    it('should render children', () => {
      render(
        <Header>
          <div>Children content</div>
        </Header>,
      )
      expect(screen.getByText('Children content')).toBeInTheDocument()
    })
  })
  describe('Content', () => {
    it('should render children', () => {
      render(
        <Content>
          <div>Children content</div>
        </Content>,
      )
      expect(screen.getByText('Children content')).toBeInTheDocument()
    })
  })
  describe('Footer', () => {
    it('should render children', () => {
      render(
        <Footer>
          <div>Children content</div>
        </Footer>,
      )
      expect(screen.getByText('Children content')).toBeInTheDocument()
    })
  })
  describe('Title', () => {
    it('should render title text', () => {
      render(<Title budgetName="Test Budget" />)
      expect(screen.getByText('Current Budget')).toBeInTheDocument()
    })
  })
  it('should render the budget name', () => {
    render(<Title budgetName="Test Budget" />)
    expect(screen.getByText('Test Budget')).toBeInTheDocument()
  })
})
describe('ViewTrigger', () => {
  const TestableRouterUI = ({ children }: { children: React.ReactNode }) => {
    const rootRoute = createRootRoute({
      component: () => children,
    })

    const router = useMemo(
      () =>
        createRouter({
          routeTree: rootRoute.addChildren([
            createRoute({
              path: '*',
              component: () => children,
              getParentRoute: () => rootRoute,
            }),
          ]),
        }),
      [children, rootRoute],
    )

    return <RouterProvider router={router} />
  }
  it('should render "View" text', async () => {
    await act(() =>
      render(
        <TestableRouterUI>
          <ViewTrigger url="/" />
        </TestableRouterUI>,
      ),
    )
    expect(screen.getByText('View')).toBeInTheDocument()
  })
  it('should render a link', async () => {
    await act(() =>
      render(
        <TestableRouterUI>
          <ViewTrigger url="/" />
        </TestableRouterUI>,
      ),
    )
    expect(screen.getByRole('link')).toBeInTheDocument()
  })
})
describe('HideTrigger', () => {
  const handleClick = vi.fn()
  it('should render a button', () => {
    render(
      <HideTrigger handleClick={handleClick}>
        <div>Children content</div>
      </HideTrigger>,
    )
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
  it('should call a function handleClick', () => {
    render(
      <HideTrigger handleClick={handleClick}>
        <div>Children content</div>
      </HideTrigger>,
    )
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(handleClick).toHaveBeenCalled()
  })
})
describe('CurrentAmount', () => {
  it('should render an amount', () => {
    render(<CurrentAmount amount="R14 000" />)
    expect(screen.getByText(/R14 000/i)).toBeInTheDocument()
  })
})
describe('RemainingAmount', () => {
  it('should render an amount', () => {
    render(<RemainingAmount amount="R14 000" />)
    expect(screen.getByText(/R14 000/i)).toBeInTheDocument()
  })
})
describe('SpentAmount', () => {
  it('should render an amount', () => {
    render(<SpentAmount amount="R14 000" />)
    expect(screen.getByText(/R14 000/i)).toBeInTheDocument()
  })
})
describe('SpentPercentage', () => {
  it('should render a percentage', () => {
    render(<SpentPercentage percentage={50} />)
    expect(screen.getByText(/%50/i)).toBeInTheDocument()
  })
})
