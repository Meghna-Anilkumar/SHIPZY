import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "min-h-20 w-full rounded-md border border-[#d8bca3] bg-white px-3 py-2 text-sm text-[#2b1d15] outline-none placeholder:text-[#a17a56] focus:border-[#f28705]",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
