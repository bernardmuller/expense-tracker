import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-b from-primary to-primary/90 text-primary-foreground shadow hover:from-primary/95 hover:to-primary/85",
        destructive:
          "bg-gradient-to-b from-destructive to-destructive/90 text-destructive-foreground shadow-sm hover:from-destructive/95 hover:to-destructive/85",
        outline:
          "border border-input bg-gradient-to-b from-background to-background/95 shadow-sm hover:from-accent hover:to-accent/90 hover:text-accent-foreground",
        secondary:
          "bg-gradient-to-b from-secondary to-secondary/90 text-secondary-foreground shadow-sm hover:from-secondary/90 hover:to-secondary/75",
        ghost: "hover:bg-gradient-to-b hover:from-accent hover:to-accent/90 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        accent: "bg-gradient-to-b from-accent to-accent/90 text-accent-foreground shadow-sm hover:from-accent/90 hover:to-accent/75",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
