import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import * as KpiCard from '../KpiCard'
import {
  generateKpiCardData,
  generateTotalSpentKpiData,
  generateBudgetUtilizationOverKpiData,
} from '../__mocks__/kpiCardProps.mock'

describe('KpiCard.Root', () => {
  it('renders children', () => {
    render(<KpiCard.Root>Test Content</KpiCard.Root>)
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('applies correct background and border styles', () => {
    const { container } = render(<KpiCard.Root>Content</KpiCard.Root>)
    const root = container.firstChild as HTMLElement
    expect(root).toHaveClass('bg-[#13131a]', 'border-[#1e1e28]', 'rounded-xl')
  })

  it('merges custom className', () => {
    const { container } = render(
      <KpiCard.Root className="custom-class">Content</KpiCard.Root>,
    )
    const root = container.firstChild as HTMLElement
    expect(root).toHaveClass('bg-[#13131a]', 'custom-class')
  })
})

describe('KpiCard.Title', () => {
  it('renders children', () => {
    render(<KpiCard.Title>Total Spent</KpiCard.Title>)
    expect(screen.getByText('Total Spent')).toBeInTheDocument()
  })

  it('applies correct font and text styles', () => {
    const { container } = render(<KpiCard.Title>Total Spent</KpiCard.Title>)
    const title = container.firstChild as HTMLElement
    expect(title).toHaveClass(
      'font-sans',
      'text-[10px]',
      'uppercase',
      'tracking-[0.14em]',
      'text-[#555]',
    )
  })

  it('merges custom className', () => {
    const { container } = render(
      <KpiCard.Title className="custom-title">Total Spent</KpiCard.Title>,
    )
    const title = container.firstChild as HTMLElement
    expect(title).toHaveClass('font-sans', 'custom-title')
  })
})

describe('KpiCard.PositiveValue', () => {
  it('renders children', () => {
    render(<KpiCard.PositiveValue>87%</KpiCard.PositiveValue>)
    expect(screen.getByText('87%')).toBeInTheDocument()
  })

  it('applies font-grotesk class', () => {
    const { container } = render(
      <KpiCard.PositiveValue>87%</KpiCard.PositiveValue>,
    )
    const value = container.firstChild as HTMLElement
    expect(value).toHaveClass('font-grotesk')
  })

  it('applies text-primary color class', () => {
    const { container } = render(
      <KpiCard.PositiveValue>87%</KpiCard.PositiveValue>,
    )
    const value = container.firstChild as HTMLElement
    expect(value).toHaveClass('text-primary')
  })

  it('applies correct size and weight', () => {
    const { container } = render(
      <KpiCard.PositiveValue>87%</KpiCard.PositiveValue>,
    )
    const value = container.firstChild as HTMLElement
    expect(value).toHaveClass('text-[26px]', 'font-medium')
  })

  it('merges custom className', () => {
    const { container } = render(
      <KpiCard.PositiveValue className="custom-value">
        87%
      </KpiCard.PositiveValue>,
    )
    const value = container.firstChild as HTMLElement
    expect(value).toHaveClass('font-grotesk', 'text-primary', 'custom-value')
  })
})

describe('KpiCard.NegativeValue', () => {
  it('renders children', () => {
    render(<KpiCard.NegativeValue>112%</KpiCard.NegativeValue>)
    expect(screen.getByText('112%')).toBeInTheDocument()
  })

  it('applies font-grotesk class', () => {
    const { container } = render(
      <KpiCard.NegativeValue>112%</KpiCard.NegativeValue>,
    )
    const value = container.firstChild as HTMLElement
    expect(value).toHaveClass('font-grotesk')
  })

  it('applies red color class', () => {
    const { container } = render(
      <KpiCard.NegativeValue>112%</KpiCard.NegativeValue>,
    )
    const value = container.firstChild as HTMLElement
    expect(value).toHaveClass('text-[#ff6b6b]')
  })

  it('applies correct size and weight', () => {
    const { container } = render(
      <KpiCard.NegativeValue>112%</KpiCard.NegativeValue>,
    )
    const value = container.firstChild as HTMLElement
    expect(value).toHaveClass('text-[26px]', 'font-medium')
  })

  it('merges custom className', () => {
    const { container } = render(
      <KpiCard.NegativeValue className="custom-value">
        112%
      </KpiCard.NegativeValue>,
    )
    const value = container.firstChild as HTMLElement
    expect(value).toHaveClass('font-grotesk', 'text-[#ff6b6b]', 'custom-value')
  })
})

describe('KpiCard.Subtext', () => {
  it('renders children', () => {
    render(<KpiCard.Subtext>within budget</KpiCard.Subtext>)
    expect(screen.getByText('within budget')).toBeInTheDocument()
  })

  it('applies correct font and text styles', () => {
    const { container } = render(
      <KpiCard.Subtext>within budget</KpiCard.Subtext>,
    )
    const subtext = container.firstChild as HTMLElement
    expect(subtext).toHaveClass('font-sans', 'text-[11px]', 'text-[#444]')
  })

  it('merges custom className', () => {
    const { container } = render(
      <KpiCard.Subtext className="custom-sub">within budget</KpiCard.Subtext>,
    )
    const subtext = container.firstChild as HTMLElement
    expect(subtext).toHaveClass('font-sans', 'custom-sub')
  })
})

describe('KpiCard - Data Display', () => {
  it('displays total spent KPI data correctly', () => {
    const data = generateTotalSpentKpiData()
    render(
      <KpiCard.Root>
        <KpiCard.Title>{data.label}</KpiCard.Title>
        <KpiCard.PositiveValue>{data.value}</KpiCard.PositiveValue>
        <KpiCard.Subtext>{data.sub}</KpiCard.Subtext>
      </KpiCard.Root>,
    )

    expect(screen.getByText(data.label)).toBeInTheDocument()
    expect(screen.getByText(data.value)).toBeInTheDocument()
    expect(screen.getByText(data.sub)).toBeInTheDocument()
  })

  it('displays budget utilization over data correctly with negative value', () => {
    const data = generateBudgetUtilizationOverKpiData()
    render(
      <KpiCard.Root>
        <KpiCard.Title>{data.label}</KpiCard.Title>
        <KpiCard.NegativeValue>{data.value}</KpiCard.NegativeValue>
        <KpiCard.Subtext>{data.sub}</KpiCard.Subtext>
      </KpiCard.Root>,
    )

    expect(screen.getByText(data.label)).toBeInTheDocument()
    expect(screen.getByText(data.value)).toBeInTheDocument()
    expect(screen.getByText(data.sub)).toBeInTheDocument()
  })

  it('displays custom KPI data with overwrites', () => {
    const data = generateKpiCardData({
      label: 'Custom Metric',
      value: '42',
      sub: 'custom description',
    })

    render(
      <KpiCard.Root>
        <KpiCard.Title>{data.label}</KpiCard.Title>
        <KpiCard.PositiveValue>{data.value}</KpiCard.PositiveValue>
        <KpiCard.Subtext>{data.sub}</KpiCard.Subtext>
      </KpiCard.Root>,
    )

    expect(screen.getByText('Custom Metric')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByText('custom description')).toBeInTheDocument()
  })
})

describe('KpiCard - Font Classes', () => {
  it('applies Space Grotesk font to positive values', () => {
    const { container } = render(
      <KpiCard.PositiveValue>12.5k</KpiCard.PositiveValue>,
    )
    const value = container.firstChild as HTMLElement
    expect(value).toHaveClass('font-grotesk')
  })

  it('applies Space Grotesk font to negative values', () => {
    const { container } = render(
      <KpiCard.NegativeValue>112%</KpiCard.NegativeValue>,
    )
    const value = container.firstChild as HTMLElement
    expect(value).toHaveClass('font-grotesk')
  })

  it('applies DM Sans font to title', () => {
    const { container } = render(
      <KpiCard.Title>Budget Utilization</KpiCard.Title>,
    )
    const title = container.firstChild as HTMLElement
    expect(title).toHaveClass('font-sans')
  })

  it('applies DM Sans font to subtext', () => {
    const { container } = render(
      <KpiCard.Subtext>within budget</KpiCard.Subtext>,
    )
    const subtext = container.firstChild as HTMLElement
    expect(subtext).toHaveClass('font-sans')
  })
})

describe('KpiCard - Color Classes', () => {
  it('applies primary color to positive values', () => {
    const { container } = render(
      <KpiCard.PositiveValue>87%</KpiCard.PositiveValue>,
    )
    const value = container.firstChild as HTMLElement
    expect(value).toHaveClass('text-primary')
  })

  it('applies red color to negative values', () => {
    const { container } = render(
      <KpiCard.NegativeValue>112%</KpiCard.NegativeValue>,
    )
    const value = container.firstChild as HTMLElement
    expect(value).toHaveClass('text-[#ff6b6b]')
  })
})
