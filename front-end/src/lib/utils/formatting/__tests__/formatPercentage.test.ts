import { formatPercentage } from "../formatPercentage"

describe("formatPercentage", () => {
  it('should take a number and format it as a percentage', () => {
    const formattedPercentage = formatPercentage(25)
    expect(formattedPercentage).toBe("25.0%")
  })
})
