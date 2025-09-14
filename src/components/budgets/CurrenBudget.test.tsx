import { describe, expect, it } from 'vitest'
import { render, screen } from '../../../test/test-utils'
import CurrentBudget from './CurrentBudget'
import type { ActiveBudgetByUserId } from '@/server/queries/budgets'

const mockBudget: ActiveBudgetByUserId = {
	id: 1,
	userId: 'user1',
	name: 'Test Budget',
	startAmount: '1000.00',
	currentAmount: '750.00',
	isActive: true,
	createdAt: new Date(),
	updatedAt: new Date(),
	deletedAt: null
}


describe('CurrentBudget component', () => {
	it("renders on the page", () => {
		const mockOnAmountVisible = () => { }
		render(<CurrentBudget
			budget={mockBudget}
			currencySymbol='R'
			isAmountVisible={false}
			onAmountVisible={mockOnAmountVisible}
		/>)
		expect(screen.getByText("Current Budget")).toBeInTheDocument();
	})
})
