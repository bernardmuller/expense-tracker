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
  swipeThreshold = 100,
}: SwiperProps) => {
  const { swiperRef, handleScroll, resetToCenter } = useSwiper({
    swipeThreshold,
  })

  const handleActionClick = async (
    action: () => void | Promise<void>,
    direction: 'left' | 'right',
  ) => {
    onSwipeStart?.(direction)
    await action()
    resetToCenter()
    setTimeout(() => {
      onSwipeEnd?.()
    }, 300)
  }

  return (
    <div
      ref={swiperRef}
      onScroll={handleScroll}
      className={cn(
        'flex overflow-x-auto',
        'scroll-snap-x scroll-snap-mandatory',
        '[scrollbar-width:none]',
        '[&::-webkit-scrollbar]:hidden',
        className,
      )}
    >
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
      <div className={cn('scroll-snap-center', 'shrink-0')}>
        <div className="">{children}</div>
      </div>
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
