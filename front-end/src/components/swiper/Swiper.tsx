import { useSwiper } from './useSwiper'
import type { SwiperProps } from './Swiper.types'
import { cn } from '@/lib/utils/cn'

export const Swiper = ({
  children,
  leftAction,
  rightAction,
  className,
  onSwipeStart,
  onSwipeEnd,
  swipeThreshold = 110,
}: SwiperProps) => {
  const { swiperRef, handleScroll, resetToCenter } = useSwiper({
    swipeThreshold,
  })

  const handleActionClick = async (
    action: () => void | Promise<void>,
    direction: 'left' | 'right',
  ) => {
    onSwipeStart?.(direction)

    // Execute the action
    await action()

    // Reset to center with smooth animation
    resetToCenter()

    // Wait for animation to complete before calling onSwipeEnd
    setTimeout(() => {
      onSwipeEnd?.()
    }, 300)
  }

  return (
    <div
      ref={swiperRef}
      onScroll={handleScroll}
      className={cn(
        'grid grid-flow-col grid-cols-[auto_1fr_auto] overflow-x-auto',
        'scroll-snap-x scroll-snap-mandatory',
        '[container-type:inline-size]',
        '[scrollbar-width:none]',
        '[&::-webkit-scrollbar]:hidden',
        className,
      )}
    >
      {/* Left Action Button */}
      {leftAction && (
        <button
          onClick={() => handleActionClick(leftAction.onAction, 'left')}
          style={{
            backgroundColor: leftAction.backgroundColor || '#ef4444',
            width: leftAction.width || '200px',
          }}
          className={cn(
            'scroll-snap-start flex items-center justify-center',
            'shrink-0 transition-colors hover:opacity-90',
            leftAction.className,
          )}
        >
          {leftAction.content}
        </button>
      )}

      {/* Main Content - Spans full viewport width (100cqw = 100% container query width) */}
      <div
        className={cn('scroll-snap-center', 'px-5 py-2.5', '[width:100cqw]')}
      >
        {children}
      </div>

      {/* Right Action Button */}
      {rightAction && (
        <button
          onClick={() => handleActionClick(rightAction.onAction, 'right')}
          style={{
            backgroundColor: rightAction.backgroundColor || '#10b981',
            width: rightAction.width || '200px',
          }}
          className={cn(
            'scroll-snap-end flex items-center justify-center',
            'shrink-0 transition-colors hover:opacity-90',
            rightAction.className,
          )}
        >
          {rightAction.content}
        </button>
      )}
    </div>
  )
}

Swiper.displayName = 'Swiper'
