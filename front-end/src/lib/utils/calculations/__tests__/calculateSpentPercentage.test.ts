import { calculateSpentPercentage } from '../calculateSpentPercentage'

describe('calculateSpentPercentage', () => {
  it('should return the spent percentage', () => {
    const result = calculateSpentPercentage(100, 25)
    expect(result).toBe(25)
  })
  it('should return 0 if the starting amount is 0', () => {
    const result = calculateSpentPercentage(0, 25)
    expect(result).toBe(0)
  })
})
