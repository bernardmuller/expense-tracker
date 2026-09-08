import { useEffect } from 'react'
import confetti from 'canvas-confetti'

export function Confetti() {
  useEffect(() => {
    const isMobile =
      window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 480

    const timer = setTimeout(() => {
      if (!isMobile) {
        confetti({
          particleCount: 40,
          spread: 70,
          origin: { x: 0, y: 0.3 },
          angle: 45,
          startVelocity: 60,
          drift: 0.5,
          ticks: 250,
        })
        confetti({
          particleCount: 40,
          spread: 70,
          origin: { x: 1, y: 0.3 },
          angle: 135,
          startVelocity: 60,
          drift: -0.5,
          ticks: 250,
        })
      } else {
        confetti({
          particleCount: 80,
          spread: 40,
          origin: { x: 0.5, y: 1 },
          angle: 90,
          startVelocity: 90,
          ticks: 300,
        })
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return null
}
