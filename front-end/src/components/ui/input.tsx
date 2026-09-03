import * as React from 'react'

import { cn } from '@/lib/utils/cn'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        `file:text-foreground placeholder:text-muted-foreground
        selection:bg-primary selection:text-primary-foreground
        border-border bg-input h-11 w-full min-w-0 rounded-2xl border px-4 py-1
        text-base transition-[color,box-shadow,transform] outline-none
        [box-shadow:inset_0_2px_0_color-mix(in_srgb,var(--color-border)_45%,black),inset_0_-1px_0_color-mix(in_srgb,var(--color-border)_30%,transparent)]
        dark:bg-input/40 file:inline-flex file:h-7 file:border-0
        file:bg-transparent file:text-sm file:font-medium
        disabled:pointer-events-none disabled:cursor-not-allowed
        disabled:opacity-50 md:text-sm motion-reduce:transition-none`,
        `focus-visible:border-ring focus-visible:ring-ring/40
        focus-visible:ring-[3px] focus-visible:[box-shadow:inset_0_2px_0_color-mix(in_srgb,var(--color-ring)_25%,transparent),inset_0_0_0_1px_var(--color-ring)]`,
        `aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40
        aria-invalid:border-destructive aria-invalid:[box-shadow:inset_0_2px_0_color-mix(in_srgb,var(--color-destructive)_25%,transparent),inset_0_0_0_1px_var(--color-destructive)]`,
        className,
      )}
      {...props}
    />
  )
}

export { Input }
