import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "group/badge inline-flex min-h-7 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden border-2 border-ink px-3 py-1 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.08em] whitespace-nowrap rounded-[4px] transition-all duration-150 shadow-brutal",
  {
    variants: {
      variant: {
        default: "bg-paper text-ink",
        secondary: "bg-accent text-ink",
        destructive: "bg-alert text-paper",
        outline: "bg-transparent text-ink border-ink",
        invert: "bg-ink text-paper",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  });
}

export { Badge, badgeVariants };
