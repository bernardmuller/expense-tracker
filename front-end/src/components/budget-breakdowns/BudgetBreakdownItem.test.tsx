import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { BudgetBreakdownItem } from './BudgetBreakdownItem'


describe('BudgetBreakdownItem', () => {
  describe('Root Component', () => {
    it('should render children', () => {
      render(
        <BudgetBreakdownItem>
          <div>Test Content</div>
        </BudgetBreakdownItem>,
      )
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })
  })
})
