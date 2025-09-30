import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--border-radius)] text-sm font-[var(--base-font-weight)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-2 border-[var(--blank)]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--main)] text-[var(--text)] shadow-[var(--shadow)] hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none",
        neutral:
          "bg-[var(--bw)] text-[var(--text)] shadow-[var(--shadow)] hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none",
        noShadow:
          "bg-[var(--bw)] text-[var(--text)] hover:bg-[var(--bg)]",
        reverse:
          "bg-[var(--main)] text-[var(--text)] shadow-[var(--shadow)] hover:translate-x-reverseBoxShadowX hover:translate-y-reverseBoxShadowY hover:shadow-none",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-11 px-6",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const NeoButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
NeoButton.displayName = "NeoButton"

export { NeoButton, buttonVariants }
