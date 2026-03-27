"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center font-mono uppercase tracking-[0.08em] whitespace-nowrap select-none border-[3px] rounded-[6px] shadow-brutal transition-all duration-150 outline-none focus-visible:outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-0 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)] hover:-translate-y-[2px] hover:shadow-brutal-lg active:translate-y-0",
        outline:
          "bg-[var(--paper)] text-[var(--ink)] border-[var(--ink)] hover:-translate-y-[2px] hover:shadow-brutal-lg active:translate-y-0",
        secondary:
          "bg-[var(--accent)] text-[var(--ink)] border-[var(--ink)] hover:-translate-y-[2px] hover:shadow-brutal-lg active:translate-y-0",
        ghost:
          "bg-transparent text-[var(--ink)] border-transparent hover:bg-[var(--paper)] hover:-translate-y-[2px] hover:shadow-brutal",
        destructive:
          "bg-[var(--alert)] text-[var(--paper)] border-[var(--ink)] hover:-translate-y-[2px] hover:shadow-brutal-lg active:translate-y-0",
        link: "border-transparent bg-transparent text-[var(--ink)] underline underline-offset-4 hover:text-[var(--alert)]",
      },
      size: {
        default: "h-11 gap-2 px-4 text-xs sm:text-sm has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-8 gap-2 px-3 text-[10px]",
        sm: "h-9 gap-2 px-3 text-xs",
        lg: "h-12 gap-3 px-5 text-sm",
        icon: "size-11",
        "icon-xs": "size-8 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
