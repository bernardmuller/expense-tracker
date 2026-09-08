import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils/cn'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground font-grotesk font-semibold rounded-2xl [box-shadow:inset_0_2px_0_color-mix(in_srgb,white_45%,transparent),0_5px_0_color-mix(in_srgb,var(--color-primary)_72%,black)] hover:bg-primary/90 hover:-translate-y-0.5 hover:[box-shadow:inset_0_2px_0_color-mix(in_srgb,white_45%,transparent),0_7px_0_color-mix(in_srgb,var(--color-primary)_72%,black)] active:translate-y-1 active:[box-shadow:inset_0_1px_0_color-mix(in_srgb,white_45%,transparent),0_2px_0_color-mix(in_srgb,var(--color-primary)_72%,black)] disabled:translate-y-0 disabled:[box-shadow:none]',
        destructive:
          'bg-destructive text-white font-grotesk font-semibold rounded-2xl [box-shadow:0_5px_0_color-mix(in_srgb,var(--color-destructive)_65%,black)] hover:bg-destructive/90 hover:-translate-y-0.5 hover:[box-shadow:0_7px_0_color-mix(in_srgb,var(--color-destructive)_65%,black)] active:translate-y-1 active:[box-shadow:0_2px_0_color-mix(in_srgb,var(--color-destructive)_65%,black)] disabled:translate-y-0 disabled:[box-shadow:none] focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/80',
        outline:
          'border border-border bg-background font-grotesk font-medium rounded-lg shadow-[0_2px_0_color-mix(in_srgb,var(--color-border)_80%,black)] hover:bg-accent hover:text-accent-foreground hover:shadow-[0_3px_0_color-mix(in_srgb,var(--color-border)_80%,black)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_1px_0_color-mix(in_srgb,var(--color-border)_80%,black)] dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground font-grotesk font-semibold rounded-2xl [box-shadow:0_5px_0_color-mix(in_srgb,var(--color-secondary)_62%,black)] hover:bg-secondary/85 hover:-translate-y-0.5 hover:[box-shadow:0_7px_0_color-mix(in_srgb,var(--color-secondary)_62%,black)] active:translate-y-1 active:[box-shadow:0_2px_0_color-mix(in_srgb,var(--color-secondary)_62%,black)] disabled:translate-y-0 disabled:[box-shadow:none]',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-5 py-2 has-[>svg]:px-3',
        sm: 'h-9 gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-14 px-7 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
