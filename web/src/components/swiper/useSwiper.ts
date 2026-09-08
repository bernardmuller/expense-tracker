import { useEffect, useRef, useState, useCallback } from 'react'
import type { UseSwiperReturn } from './Swiper.types'

interface UseSwiperOptions {
  swipeThreshold?: number
}

const getCenterElement = (swiper: HTMLDivElement): HTMLElement | null => {
  return swiper.querySelector('.scroll-snap-center')
}

export const useSwiper = (options: UseSwiperOptions = {}): UseSwiperReturn => {
  const { swipeThreshold = 100 } = options
  const swiperRef = useRef<HTMLDivElement>(null)
  const [scrollDelta, setScrollDelta] = useState(0)

  useEffect(() => {
    const swiper = swiperRef.current
    if (!swiper) return

    const centerElement = getCenterElement(swiper)
    if (!centerElement) return

    const updateContentWidth = () => {
      const containerWidth = swiper.clientWidth
      centerElement.style.width = `${containerWidth}px`
    }

    updateContentWidth()

    requestAnimationFrame(() => {
      swiper.scrollLeft = -centerElement.offsetLeft
    })

    const resizeObserver = new ResizeObserver(updateContentWidth)
    resizeObserver.observe(swiper)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    const swiper = swiperRef.current
    if (!swiper) return

    const handleScrollEnd = () => {
      const centerElement = getCenterElement(swiper)
      if (!centerElement) return

      const centerPosition = centerElement.offsetLeft * 2.5
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

    const centerElement = getCenterElement(swiper)
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
