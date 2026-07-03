import { useEffect, useRef } from 'react'
import { useAuth } from '@/lib/auth/auth-provider'
import { useCheckIn } from '@/lib/http/hooks/use-check-in'

const pad = (n: number): string => String(n).padStart(2, '0')

const todayString = (): string => {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/**
 * Records one app-open per authenticated session per day. Rendered once at the
 * router root; it renders nothing. Recording here (rather than on every
 * navigation) keeps a day's activity count meaningful — one session, one open.
 */
export function StreakCheckIn() {
  const { isAuthenticated } = useAuth()
  const checkIn = useCheckIn()
  const firedRef = useRef(false)

  useEffect(() => {
    if (!isAuthenticated || firedRef.current) return

    const key = `streak-checked-in:${todayString()}`
    if (sessionStorage.getItem(key)) return

    firedRef.current = true
    sessionStorage.setItem(key, '1')
    checkIn.mutate()
    // checkIn.mutate is stable across renders (react-query); intentionally
    // excluded so this fires only when auth state changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  return null
}
