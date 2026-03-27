"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive, type CheckboxRootProps } from "@base-ui/react/checkbox"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const checkboxVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded border border-input transition-all outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      size: {
        default: "size-4",
        sm: "size-3",
        lg: "size-5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const Checkbox = React.forwardRef<
  HTMLButtonElement,
  CheckboxRootProps & VariantProps<typeof checkboxVariants>
>(({ className, size = "default", ...props }, ref) => {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      ref={ref}
      className={cn(checkboxVariants({ size }), className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className="size-full flex items-center justify-center text-foreground"
      >
        <svg
          className="size-2.5 shrink-0 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12l5 5 9-9" />
        </svg>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
})
Checkbox.displayName = "Checkbox"

export { Checkbox, checkboxVariants }
