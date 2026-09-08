import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import * as AppHeader from '../AppHeader.compound'

describe('AppHeader.Root', () => {
  it('renders children', () => {
    render(<AppHeader.Root>Test Content</AppHeader.Root>)
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('applies default flex layout classes', () => {
    const { container } = render(<AppHeader.Root>Content</AppHeader.Root>)
    const root = container.firstChild as HTMLElement
    expect(root).toHaveClass('flex', 'items-center', 'justify-between')
  })

  it('merges custom className', () => {
    const { container } = render(
      <AppHeader.Root className="custom-class">Content</AppHeader.Root>,
    )
    const root = container.firstChild as HTMLElement
    expect(root).toHaveClass(
      'flex',
      'items-center',
      'justify-between',
      'custom-class',
    )
  })
})

describe('AppHeader.Content', () => {
  it('renders children', () => {
    render(<AppHeader.Content>Test Content</AppHeader.Content>)
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('applies flex layout classes', () => {
    const { container } = render(<AppHeader.Content>Content</AppHeader.Content>)
    const content = container.firstChild as HTMLElement
    expect(content).toHaveClass('flex', 'items-center', 'gap-3')
  })

  it('merges custom className', () => {
    const { container } = render(
      <AppHeader.Content className="custom-gap">Content</AppHeader.Content>,
    )
    const content = container.firstChild as HTMLElement
    expect(content).toHaveClass('flex', 'items-center', 'gap-3', 'custom-gap')
  })
})

describe('AppHeader.Icon', () => {
  it('renders image with correct src and alt', () => {
    render(<AppHeader.Icon src="/test.ico" alt="Test Icon" />)
    const img = screen.getByAltText('Test Icon')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/test.ico')
  })

  it('applies circular background container classes', () => {
    const { container } = render(
      <AppHeader.Icon src="/test.ico" alt="Test Icon" />,
    )
    const iconContainer = container.firstChild as HTMLElement
    expect(iconContainer).toHaveClass(
      'bg-background',
      'flex',
      'h-12',
      'w-12',
      'items-center',
      'justify-center',
      'rounded-full',
      'border',
    )
  })

  it('applies image size classes', () => {
    render(<AppHeader.Icon src="/test.ico" alt="Test Icon" />)
    const img = screen.getByAltText('Test Icon')
    expect(img).toHaveClass('h-8', 'w-8')
  })

  it('merges custom className', () => {
    const { container } = render(
      <AppHeader.Icon
        src="/test.ico"
        alt="Test Icon"
        className="custom-icon"
      />,
    )
    const iconContainer = container.firstChild as HTMLElement
    expect(iconContainer).toHaveClass(
      'bg-background',
      'flex',
      'h-12',
      'w-12',
      'items-center',
      'justify-center',
      'rounded-full',
      'border',
      'custom-icon',
    )
  })
})

describe('AppHeader.Info', () => {
  it('renders app name and message', () => {
    render(<AppHeader.Info appName="Test App" message="Welcome!" />)
    expect(screen.getByText('Test App')).toBeInTheDocument()
    expect(screen.getByText('Welcome!')).toBeInTheDocument()
  })

  it('applies correct styling to app name', () => {
    render(<AppHeader.Info appName="Test App" message="Welcome!" />)
    const appName = screen.getByText('Test App')
    expect(appName).toHaveClass('text-sm', 'font-semibold')
  })

  it('applies correct styling to message', () => {
    render(<AppHeader.Info appName="Test App" message="Welcome!" />)
    const message = screen.getByText('Welcome!')
    expect(message).toHaveClass('text-muted-foreground', 'text-xs')
  })

  it('applies flex column layout', () => {
    const { container } = render(
      <AppHeader.Info appName="Test App" message="Welcome!" />,
    )
    const info = container.firstChild as HTMLElement
    expect(info).toHaveClass('flex', 'flex-col')
  })

  it('merges custom className', () => {
    const { container } = render(
      <AppHeader.Info
        appName="Test App"
        message="Welcome!"
        className="custom-info"
      />,
    )
    const info = container.firstChild as HTMLElement
    expect(info).toHaveClass('flex', 'flex-col', 'custom-info')
  })
})

describe('AppHeader.Action', () => {
  it('renders children', () => {
    render(
      <AppHeader.Action>
        <button>Action Button</button>
      </AppHeader.Action>,
    )
    expect(screen.getByText('Action Button')).toBeInTheDocument()
  })

  it('accepts custom className', () => {
    const { container } = render(
      <AppHeader.Action className="custom-action">
        <button>Action</button>
      </AppHeader.Action>,
    )
    const action = container.firstChild as HTMLElement
    expect(action).toHaveClass('custom-action')
  })

  it('renders complex children like links', () => {
    render(
      <AppHeader.Action>
        <a href="/profile">Profile Link</a>
      </AppHeader.Action>,
    )
    const link = screen.getByText('Profile Link')
    expect(link).toBeInTheDocument()
    expect(link.tagName).toBe('A')
  })
})

describe('AppHeader Composition', () => {
  it('renders complete header composition', () => {
    render(
      <AppHeader.Root>
        <AppHeader.Content>
          <AppHeader.Icon src="/favicon.ico" alt="App Icon" />
          <AppHeader.Info appName="Expense Tracker" message="Hi, John!" />
        </AppHeader.Content>
        <AppHeader.Action>
          <button>Profile</button>
        </AppHeader.Action>
      </AppHeader.Root>,
    )

    expect(screen.getByAltText('App Icon')).toBeInTheDocument()
    expect(screen.getByText('Expense Tracker')).toBeInTheDocument()
    expect(screen.getByText('Hi, John!')).toBeInTheDocument()
    expect(screen.getByText('Profile')).toBeInTheDocument()
  })

  it('supports flexible composition', () => {
    render(
      <AppHeader.Root>
        <AppHeader.Content>
          <AppHeader.Info appName="Custom App" message="Custom Message" />
        </AppHeader.Content>
        <AppHeader.Action>
          <div>Custom Action</div>
        </AppHeader.Action>
      </AppHeader.Root>,
    )

    expect(screen.getByText('Custom App')).toBeInTheDocument()
    expect(screen.getByText('Custom Message')).toBeInTheDocument()
    expect(screen.getByText('Custom Action')).toBeInTheDocument()
  })

  it('allows omitting Icon component', () => {
    render(
      <AppHeader.Root>
        <AppHeader.Content>
          <AppHeader.Info appName="Simple App" message="No icon here" />
        </AppHeader.Content>
        <AppHeader.Action>
          <button>Action</button>
        </AppHeader.Action>
      </AppHeader.Root>,
    )

    expect(screen.getByText('Simple App')).toBeInTheDocument()
    expect(screen.getByText('No icon here')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})
