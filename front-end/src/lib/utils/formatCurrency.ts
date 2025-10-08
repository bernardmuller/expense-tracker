import { supportedLocales } from '../constants/supportedLocales'
import type { SupportedLocalesValues } from '../types/supportedLocalesValues'

export function formatCurrency(value: number, locale: SupportedLocalesValues) {
  switch (locale) {
    case supportedLocales.SOUTH_AFRICA:
      return `R${value.toLocaleString('en-ZA')}`
    default:
      throw new Error(`Locale ${locale} is not a supported locale.`)
  }
}
