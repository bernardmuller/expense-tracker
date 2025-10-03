import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import BudgetBreakdownItem from '@/components/budget-breakdowns/BudgetBreakdownItem'
import { generateBudgetBreakdownItemProps } from './__mocks__/budgetBreakDownItemProps.mock'

describe('Budget Breakdwon Item', () => {
  it('renders', () => {
    const budgetBreakdownItemProps = generateBudgetBreakdownItemProps()

    const { container } = render(
      <BudgetBreakdownItem {...budgetBreakdownItemProps} />,
    )
    expect(container).toBeTruthy()
  })
})
