import type { ReactNode } from 'react'

interface SwipeActionConfig {
  /** Content to render in the action button (text, icon, etc.) */
  content: ReactNode
  /** Callback function when action button is clicked */
  onAction: () => void | Promise<void>
  /** Optional custom Tailwind classes for the action button */
  className?: string
  /** Optional background color (defaults: red for left, green for right) */
  backgroundColor?: string
  /** Optional width of the action button (default: 200px) */
  width?: string
}

export interface SwiperProps {
  /** Main content to be wrapped in the swiper */
  children: ReactNode
  /** Configuration for left swipe action (appears on left side) */
  leftAction?: SwipeActionConfig
  /** Configuration for right swipe action (appears on right side) */
  rightAction?: SwipeActionConfig
  /** Optional custom Tailwind classes for the swiper container */
  className?: string
  /** Optional callback when swipe starts */
  onSwipeStart?: (direction: 'left' | 'right') => void
  /** Optional callback when swipe ends (returns to center) */
  onSwipeEnd?: () => void
  /**
   * Swipe threshold in pixels - minimum distance to keep action revealed
   * If swipe distance < threshold, snaps back to center
   * Default: 100px (50% of default 200px action button width)
   */
  swipeThreshold?: number
}

export interface UseSwiperReturn {
  /** Ref to attach to the swiper container */
  swiperRef: React.RefObject<HTMLDivElement>
  /** Scroll event handler */
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void
  /** Function to reset swiper to center position */
  resetToCenter: () => void
  /** Current scroll delta from center */
  scrollDelta: number
}
