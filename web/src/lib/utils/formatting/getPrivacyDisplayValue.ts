const MASKED_VALUE = '********'

export function getPrivacyDisplayValue(
  value: string,
  isPrivacyEnabled: boolean,
): string {
  return isPrivacyEnabled ? MASKED_VALUE : value
}
