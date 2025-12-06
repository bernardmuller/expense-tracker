import { useState, useCallback, useEffect } from 'react'

const PRIVACY_STORAGE_KEY = 'budgetPrivacy'

export function usePrivacy() {
  const [isPrivacyEnabled, setIsPrivacyEnabled] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(PRIVACY_STORAGE_KEY)
      return stored !== null ? stored === 'true' : true
    } catch {
      return true
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(PRIVACY_STORAGE_KEY, String(isPrivacyEnabled))
    } catch {
      // Silent fail
    }
  }, [isPrivacyEnabled])

  const togglePrivacy = useCallback(() => {
    setIsPrivacyEnabled((prev) => !prev)
  }, [])

  return {
    isPrivacyEnabled,
    togglePrivacy,
  }
}
