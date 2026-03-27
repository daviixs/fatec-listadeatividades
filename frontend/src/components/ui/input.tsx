import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 border-[3px] border-ink bg-paper px-3 py-2 text-sm md:text-base font-mono rounded-[6px] shadow-brutal transition-transform duration-150 placeholder:text-ink/50 focus-visible:outline-none focus-visible:bg-accent/60 focus-visible:border-ink focus-visible:-translate-y-[1px] disabled:pointer-events-none disabled:opacity-60 aria-invalid:border-alert",
        className
      )}
      {...props}
    />
  );
}

export { Input };
