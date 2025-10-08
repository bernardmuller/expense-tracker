import { describe, expect, it } from 'vitest'
import {
  generateBudgetBreakdownItemProps,
  generateOverBudgetBreakdownItemProps,
  generatePlannedBudgetBreakdownItemProps
} from './budgetBreakDownItemProps.mock'

describe('generateBudgetBreakDownItemProps', () => {
  it('should generate budget breakdown props with all required properties', () => {
    const budgetBreakDownItemProps = generateBudgetBreakdownItemProps()
    expect(budgetBreakDownItemProps).toHaveProperty('name')
    expect(budgetBreakDownItemProps).toHaveProperty('icon')
    expect(budgetBreakDownItemProps).toHaveProperty('spentAmount')
  })
  it('should allow you to overwrite values', () => {
    const budgetBreakDownItemProps = generateBudgetBreakdownItemProps({
      name: 'testName',
      icon: 'testIcon',
      spentAmount: 'R1000',
    })
    expect(budgetBreakDownItemProps.name).toBe('testName')
    expect(budgetBreakDownItemProps.icon).toBe('testIcon')
    expect(budgetBreakDownItemProps.spentAmount).toBe('R1000')
  })
})

describe('generateOverBudgetBreakDownItemProps', () => {
  it('should generate over budget breakdown props with all required properties', () => {
    const budgetBreakDownItemProps = generateOverBudgetBreakdownItemProps()
    expect(budgetBreakDownItemProps).toHaveProperty('name')
    expect(budgetBreakDownItemProps).toHaveProperty('icon')
    expect(budgetBreakDownItemProps).toHaveProperty('spentAmount')
    expect(budgetBreakDownItemProps).toHaveProperty('plannedAmount')
  })
  it('should allow you to overwrite values', () => {
    const budgetBreakDownItemProps = generateOverBudgetBreakdownItemProps({
      name: 'testName',
      icon: 'testIcon',
      spentAmount: 'R1000',
      plannedAmount: 'R2000',
    })
    expect(budgetBreakDownItemProps.name).toBe('testName')
    expect(budgetBreakDownItemProps.icon).toBe('testIcon')
    expect(budgetBreakDownItemProps.spentAmount).toBe('R1000')
    expect(budgetBreakDownItemProps.plannedAmount).toBe('R2000')
  })
})

describe('generatePlannedBudgetBreakDownItemProps', () => {
  it('should generate planned budget breakdown props with all required properties', () => {
    const budgetBreakDownItemProps = generatePlannedBudgetBreakdownItemProps()
    expect(budgetBreakDownItemProps).toHaveProperty('name')
    expect(budgetBreakDownItemProps).toHaveProperty('icon')
    expect(budgetBreakDownItemProps).toHaveProperty('spentAmount')
    expect(budgetBreakDownItemProps).toHaveProperty('plannedAmount')
    expect(budgetBreakDownItemProps).toHaveProperty('percentage')
  })
  it('should allow you to overwrite values', () => {
    const budgetBreakDownItemProps = generatePlannedBudgetBreakdownItemProps({
      name: 'testName',
      icon: 'testIcon',
      spentAmount: 'R1000',
      plannedAmount: 'R2000',
      percentage: 100
    })
    expect(budgetBreakDownItemProps.name).toBe('testName')
    expect(budgetBreakDownItemProps.icon).toBe('testIcon')
    expect(budgetBreakDownItemProps.spentAmount).toBe('R1000')
    expect(budgetBreakDownItemProps.plannedAmount).toBe('R2000')
    expect(budgetBreakDownItemProps.percentage).toBe(100)
  })
})
