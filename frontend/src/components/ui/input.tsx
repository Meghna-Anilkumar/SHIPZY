import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md border border-[#d8bca3] bg-white px-3 py-2 text-sm text-[#2b1d15] outline-none placeholder:text-[#a17a56] focus:border-[#f28705]",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
