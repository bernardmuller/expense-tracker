import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import CategoryChart from '../CategoryChart'
import {
  generateCategoryChartProps,
  generateUnderBudgetCategoryChartProps,
  generateOverBudgetCategoryChartProps,
} from '../__mocks__/categoryChartProps.mock'
import type { MonthlyChartData } from '../CategoryChart.types'

describe('CategoryChart', () => {
  describe('Rendering', () => {
    it('should render the component with valid data', () => {
      const props = generateCategoryChartProps()
      render(<CategoryChart {...props} />)
      expect(screen.getByText(props.categoryName)).toBeInTheDocument()
    })

    it('should display the category name', () => {
      const props = generateCategoryChartProps({
        categoryName: 'Custom Category',
      })
      render(<CategoryChart {...props} />)
      expect(screen.getByText('Custom Category')).toBeInTheDocument()
    })

    it('should display the default description when not provided', () => {
      const props = generateCategoryChartProps()
      delete props.description
      render(<CategoryChart {...props} />)
      expect(
        screen.getByText('Monthly spent vs Allocated Budget'),
      ).toBeInTheDocument()
    })

    it('should display custom description when provided', () => {
      const props = generateCategoryChartProps({
        description: 'Custom description text',
      })
      render(<CategoryChart {...props} />)
      expect(screen.getByText('Custom description text')).toBeInTheDocument()
    })
  })

  describe('Legend', () => {
    it('should display all legend items', () => {
      const props = generateCategoryChartProps()
      render(<CategoryChart {...props} />)
      expect(screen.getByText('Under Budget')).toBeInTheDocument()
      expect(screen.getByText('Over Budget')).toBeInTheDocument()
      expect(screen.getByText('Budget Line')).toBeInTheDocument()
    })
  })

  describe('Data Handling', () => {
    it('should handle empty data array', () => {
      const props = generateCategoryChartProps({ data: [] })
      render(<CategoryChart {...props} />)
      expect(screen.getByText(props.categoryName)).toBeInTheDocument()
    })

    it('should handle single data point', () => {
      const singleDataPoint: Array<MonthlyChartData> = [
        { month: 'Jan', spent: 100, budget: 200 },
      ]
      const props = generateCategoryChartProps({ data: singleDataPoint })
      render(<CategoryChart {...props} />)
      expect(screen.getByText(props.categoryName)).toBeInTheDocument()
    })

    it('should render with under budget data', () => {
      const props = generateUnderBudgetCategoryChartProps()
      render(<CategoryChart {...props} />)
      expect(screen.getByText(props.categoryName)).toBeInTheDocument()
    })

    it('should render with over budget data', () => {
      const props = generateOverBudgetCategoryChartProps()
      render(<CategoryChart {...props} />)
      expect(screen.getByText(props.categoryName)).toBeInTheDocument()
    })
  })

  describe('Chart Elements', () => {
    it('should render ResponsiveContainer', () => {
      const props = generateCategoryChartProps()
      const { container } = render(<CategoryChart {...props} />)
      const responsiveContainer = container.querySelector(
        '.recharts-responsive-container',
      )
      expect(responsiveContainer).toBeInTheDocument()
    })

  })

  describe('Type Safety', () => {
    it('should accept data with correct MonthlyChartData structure', () => {
      const typedData: Array<MonthlyChartData> = [
        { month: 'Jan', spent: 100, budget: 200 },
        { month: 'Feb', spent: 150, budget: 200 },
      ]
      const props = generateCategoryChartProps({ data: typedData })
      render(<CategoryChart {...props} />)
      expect(screen.getByText(props.categoryName)).toBeInTheDocument()
    })
  })
})
