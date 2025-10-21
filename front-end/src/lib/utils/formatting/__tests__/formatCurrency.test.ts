import { describe, expect, it } from 'vitest'
import { formatCurrency } from '@/lib/utils/formatting/formatCurrency'
import { supportedLocales } from '@/lib/constants/supportedLocales'

describe('formatCurrency', () => {
  it('should take a number and za locale and return a formatted currency', () => {
    const number = 10000
    const formattedCurrency = formatCurrency(
      number,
      supportedLocales.SOUTH_AFRICA,
    )

    expect(formattedCurrency).toBe('R10\u00A0000') // apparently there are different kinds of whitespaces ??
  })
})
