import { calculateSpentAmount } from '../calculateSpentAmount'

describe('calculateSpentAmount', () => {
  it('should return the difference between the starting amount and current amount', () => {
    const result = calculateSpentAmount(10, 5)
    expect(result).toBe(5)
  })
})
