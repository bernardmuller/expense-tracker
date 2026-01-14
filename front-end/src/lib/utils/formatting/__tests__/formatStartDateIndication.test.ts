import { describe, expect, it } from 'vitest'
import { getStartDateIndication } from '@/lib/utils/formatting/formatStartDateIndication'

describe('getStartDateIndication', () => {
  describe('monthly frequency', () => {
    it('should return "Starts today" when selecting today\'s date', () => {
      const today = new Date('2026-01-14')
      const result = getStartDateIndication('monthly', 14, undefined, today)
      expect(result).toBe('Starts today')
    })

    it('should return "Starts tomorrow" when selecting tomorrow\'s date', () => {
      const today = new Date('2026-01-14')
      const result = getStartDateIndication('monthly', 15, undefined, today)
      expect(result).toBe('Starts tomorrow')
    })

    it('should return "Starts in X days" for future date in current month', () => {
      const today = new Date('2026-01-14')
      const result = getStartDateIndication('monthly', 20, undefined, today)
      expect(result).toBe('Starts in 6 days')
    })

    it('should return correct days when selected day has passed in current month', () => {
      const today = new Date('2026-01-14')
      const result = getStartDateIndication('monthly', 10, undefined, today)
      expect(result).toBe('Starts in 27 days')
    })

    it('should handle end of month correctly', () => {
      const today = new Date('2026-01-31')
      const result = getStartDateIndication('monthly', 1, undefined, today)
      expect(result).toBe('Starts tomorrow')
    })

    it('should handle selecting 31st when next month has fewer days', () => {
      const today = new Date('2026-01-15')
      const result = getStartDateIndication('monthly', 31, undefined, today)
      expect(result).toBe('Starts in 16 days')
    })

    it('should handle February with 28 days', () => {
      const today = new Date('2026-02-15')
      const result = getStartDateIndication('monthly', 31, undefined, today)
      expect(result).toBe('Starts in 13 days')
    })
  })

  describe('weekly frequency', () => {
    it('should return "Starts today" when selecting today\'s day of week', () => {
      const today = new Date('2026-01-14')
      const result = getStartDateIndication('weekly', 3, undefined, today)
      expect(result).toBe('Starts today')
    })

    it('should return "Starts tomorrow" when selecting tomorrow', () => {
      const today = new Date('2026-01-14')
      const result = getStartDateIndication('weekly', 4, undefined, today)
      expect(result).toBe('Starts tomorrow')
    })

    it('should return correct days for future day in same week', () => {
      const today = new Date('2026-01-14')
      const result = getStartDateIndication('weekly', 6, undefined, today)
      expect(result).toBe('Starts in 3 days')
    })

    it('should return correct days when day has passed this week', () => {
      const today = new Date('2026-01-14')
      const result = getStartDateIndication('weekly', 1, undefined, today)
      expect(result).toBe('Starts in 5 days')
    })
  })

  describe('bi-weekly frequency', () => {
    it('should return "Starts today" when selecting today\'s day of week', () => {
      const today = new Date('2026-01-14')
      const result = getStartDateIndication('bi-weekly', 3, undefined, today)
      expect(result).toBe('Starts today')
    })

    it('should return "Starts tomorrow" when selecting tomorrow', () => {
      const today = new Date('2026-01-14')
      const result = getStartDateIndication('bi-weekly', 4, undefined, today)
      expect(result).toBe('Starts tomorrow')
    })

    it('should return correct days for future day in same week', () => {
      const today = new Date('2026-01-14')
      const result = getStartDateIndication('bi-weekly', 6, undefined, today)
      expect(result).toBe('Starts in 3 days')
    })
  })

  describe('custom frequency', () => {
    it('should always return "Starts today"', () => {
      const today = new Date('2026-01-14')
      const result = getStartDateIndication('custom', 1, 30, today)
      expect(result).toBe('Starts today')
    })

    it('should return "Starts today" with different custom durations', () => {
      const today = new Date('2026-01-14')
      const result = getStartDateIndication('custom', 15, 45, today)
      expect(result).toBe('Starts today')
    })
  })

  describe('edge cases', () => {
    it('should handle year boundary correctly', () => {
      const today = new Date('2025-12-31')
      const result = getStartDateIndication('monthly', 1, undefined, today)
      expect(result).toBe('Starts tomorrow')
    })

    it('should handle leap year February', () => {
      const today = new Date('2024-02-15')
      const result = getStartDateIndication('monthly', 29, undefined, today)
      expect(result).toBe('Starts in 14 days')
    })

    it('should handle Sunday as day 0', () => {
      const today = new Date('2026-01-17')
      const result = getStartDateIndication('weekly', 0, undefined, today)
      expect(result).toBe('Starts tomorrow')
    })
  })
})
