import { useState, useCallback, useEffect } from 'react'
import { getItem, setItem } from '../storage/data-store'
import { STORAGE_KEYS } from '../storage/storage-keys'

export function usePrivacy() {
  const [isPrivacyEnabled, setIsPrivacyEnabled] = useState<boolean>(() => {
    try {
      const stored = getItem(STORAGE_KEYS.BUDGET_PRIVACY)
      return stored !== null ? stored === 'true' : true
    } catch {
      return true
    }
  })

  useEffect(() => {
    try {
      setItem(STORAGE_KEYS.BUDGET_PRIVACY, String(isPrivacyEnabled))
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
