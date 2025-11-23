import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import BudgetInfoForm from '../BudgetInfoForm'
import { setupUserEvent } from '@/lib/utils/testing/setupUserEvent'
import { generateFilterProps } from '@/components/filter/__mocks__/filterProps.mock'

describe('BudgetInfoForm', () => {
  const mockCategories = generateFilterProps()
  const mockOnSubmit = vi.fn()

  it('renders the form with all required fields', () => {
    render(
      <BudgetInfoForm onSubmit={mockOnSubmit} categories={mockCategories} />
    )

    expect(screen.getByText('Create Your Budget')).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('Budget name (e.g., Monthly Budget)')
    ).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('Total budget amount')
    ).toBeInTheDocument()
    expect(screen.getByText('Category Allocations')).toBeInTheDocument()
    expect(screen.getByText('Add Category')).toBeInTheDocument()
    expect(screen.getByText('Fill in budget details')).toBeInTheDocument()
  })

  it('shows validation errors when form is submitted empty', async () => {
    const user = setupUserEvent()
    render(
      <BudgetInfoForm onSubmit={mockOnSubmit} categories={mockCategories} />
    )

    const submitButton = screen.getByText('Fill in budget details')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('You must provide a budget name')).toBeInTheDocument()
      expect(screen.getByText('You must provide a budget amount')).toBeInTheDocument()
      expect(
        screen.getByText('You must add at least one category allocation')
      ).toBeInTheDocument()
    })

    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('allows adding category allocations', async () => {
    const user = setupUserEvent()
    render(
      <BudgetInfoForm onSubmit={mockOnSubmit} categories={mockCategories} />
    )

    const addButton = screen.getByText('Add Category')
    await user.click(addButton)

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Select category')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Amount')).toBeInTheDocument()
    })
  })

  it('allows removing category allocations', async () => {
    const user = setupUserEvent()
    render(
      <BudgetInfoForm onSubmit={mockOnSubmit} categories={mockCategories} />
    )

    const addButton = screen.getByText('Add Category')
    await user.click(addButton)

    await waitFor(() => {
      expect(screen.getByText('Remove')).toBeInTheDocument()
    })

    const removeButton = screen.getByText('Remove')
    await user.click(removeButton)

    await waitFor(() => {
      expect(
        screen.getByText('No categories added yet. Click "Add Category" to start.')
      ).toBeInTheDocument()
    })
  })

  it('allows adding multiple category allocations', async () => {
    const user = setupUserEvent()
    render(
      <BudgetInfoForm onSubmit={mockOnSubmit} categories={mockCategories} />
    )

    const addButton = screen.getByText('Add Category')

    // Add first category
    await user.click(addButton)
    await waitFor(() => {
      expect(screen.getAllByPlaceholderText('Select category')).toHaveLength(1)
    })

    // Add second category
    await user.click(addButton)
    await waitFor(() => {
      expect(screen.getAllByPlaceholderText('Select category')).toHaveLength(2)
    })

    // Should have 2 remove buttons
    expect(screen.getAllByText('Remove')).toHaveLength(2)
  })

  it('submits form with valid data', async () => {
    const user = setupUserEvent()
    const mockSubmit = vi.fn()

    render(
      <BudgetInfoForm onSubmit={mockSubmit} categories={mockCategories} />
    )

    // Fill in budget name
    const nameInput = screen.getByPlaceholderText('Budget name (e.g., Monthly Budget)')
    await user.type(nameInput, 'My Monthly Budget')

    // Fill in budget amount
    const amountInput = screen.getByPlaceholderText('Total budget amount')
    await user.clear(amountInput)
    await user.type(amountInput, '5000')

    // Add a category allocation
    const addButton = screen.getByText('Add Category')
    await user.click(addButton)

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Select category')).toBeInTheDocument()
    })

    // Select a category
    const categorySelect = screen.getByPlaceholderText('Select category')
    await user.click(categorySelect)

    const firstCategory = await screen.findByText(mockCategories[0].name)
    await user.click(firstCategory)

    // Fill in category amount
    const categoryAmountInput = screen.getByPlaceholderText('Amount')
    await user.clear(categoryAmountInput)
    await user.type(categoryAmountInput, '1000')

    // Submit form
    const submitButton = screen.getByText('Create Budget')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        budgetName: 'My Monthly Budget',
        budgetAmount: 5000,
        categoryAllocations: [
          {
            category: mockCategories[0].value,
            amount: 1000,
          },
        ],
      })
    })
  })

  it('validates category allocation fields when submitted', async () => {
    const user = setupUserEvent()
    render(
      <BudgetInfoForm onSubmit={mockOnSubmit} categories={mockCategories} />
    )

    // Fill in budget name and amount
    const nameInput = screen.getByPlaceholderText('Budget name (e.g., Monthly Budget)')
    await user.type(nameInput, 'Test Budget')

    const amountInput = screen.getByPlaceholderText('Total budget amount')
    await user.clear(amountInput)
    await user.type(amountInput, '1000')

    // Add a category but don't fill it in
    const addButton = screen.getByText('Add Category')
    await user.click(addButton)

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Select category')).toBeInTheDocument()
    })

    // Submit form without filling category fields
    const submitButton = screen.getByText('Create Budget')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('You must specify a category')).toBeInTheDocument()
      expect(screen.getByText('You must provide an amount')).toBeInTheDocument()
    })

    expect(mockOnSubmit).not.toHaveBeenCalled()
  })
})
