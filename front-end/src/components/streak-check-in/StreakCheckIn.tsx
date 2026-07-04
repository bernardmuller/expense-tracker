import { useEffect, useRef } from 'react'
import { useAuth } from '@/lib/auth/auth-provider'
import { useCheckIn } from '@/lib/http/hooks/use-check-in'
import * as DataStore from '@/lib/storage/data-store'
import { STORAGE_KEYS } from '@/lib/storage/storage-keys'
import { format } from 'date-fns'

export function StreakCheckIn() {
  const { isAuthenticated } = useAuth()
  const checkIn = useCheckIn()
  const firedRef = useRef(false)

  useEffect(() => {
    if (!isAuthenticated || firedRef.current) return
    const today = format(new Date(), "yyyy-MM-dd HH:mm")
    if (DataStore.getItem(STORAGE_KEYS.STREAK) === today) return
    firedRef.current = true
    DataStore.setItem(STORAGE_KEYS.STREAK, today)
    checkIn.mutate()
  }, [isAuthenticated])

  return null
}
