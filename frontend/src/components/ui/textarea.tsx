import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full rounded-[6px] border-[3px] border-ink bg-paper px-3 py-2 text-sm md:text-base font-mono shadow-brutal transition-transform duration-150 placeholder:text-ink/50 focus-visible:outline-none focus-visible:bg-accent/60 focus-visible:border-ink focus-visible:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-alert",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
