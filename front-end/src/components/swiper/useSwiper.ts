import { useEffect, useRef, useState, useCallback } from 'react'
import type { UseSwiperReturn } from './Swiper.types'

interface UseSwiperOptions {
  swipeThreshold?: number
}

export const useSwiper = (options: UseSwiperOptions = {}): UseSwiperReturn => {
  const { swipeThreshold = 100 } = options
  const swiperRef = useRef<HTMLDivElement>(null)
  const [scrollDelta, setScrollDelta] = useState(0)

  useEffect(() => {
    const swiper = swiperRef.current
    if (!swiper) return

    requestAnimationFrame(() => {
      const centerElement = swiper.children[1] as HTMLElement
      if (centerElement) {
        swiper.scrollLeft = centerElement.offsetLeft
      }
    })
  }, [])

  useEffect(() => {
    const swiper = swiperRef.current
    if (!swiper) return

    const handleScrollEnd = () => {
      const centerElement = swiper.children[1] as HTMLElement
      if (!centerElement) return

      const centerPosition = centerElement.offsetLeft
      const currentScroll = swiper.scrollLeft
      const distance = Math.abs(currentScroll - centerPosition)

      if (distance > 0 && distance < swipeThreshold) {
        swiper.scrollTo({
          left: centerPosition,
          behavior: 'smooth',
        })
      }
    }

    swiper.addEventListener('scrollend', handleScrollEnd)

    return () => {
      swiper.removeEventListener('scrollend', handleScrollEnd)
    }
  }, [swipeThreshold])

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollDiv = e.currentTarget
    const scrollCenter = scrollDiv.scrollWidth / 2
    const viewportCenter = scrollDiv.clientWidth / 2
    const current = scrollDiv.scrollLeft + viewportCenter
    const dx = current - scrollCenter

    setScrollDelta(dx)
  }, [])

  const resetToCenter = useCallback(() => {
    const swiper = swiperRef.current
    if (!swiper) return

    const centerElement = swiper.children[1] as HTMLElement
    if (centerElement) {
      swiper.scrollTo({
        left: centerElement.offsetLeft,
        behavior: 'smooth',
      })
    }
  }, [])

  return {
    swiperRef,
    handleScroll,
    resetToCenter,
    scrollDelta,
  }
}
