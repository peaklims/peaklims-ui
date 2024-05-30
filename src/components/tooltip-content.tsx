import { cn } from "@/lib/utils";
import { ReactElement, ReactNode } from "react";

export function TooltipHotkey({
  className,
  children,
}: {
  className?: string;
  children: ReactElement | ReactNode;
}) {
  return (
    <p className={cn("px-1 py-1 text-xs font-semibold", className)}>
      {children}
    </p>
  );
}
