import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

type LabelProps = React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
  VariantProps<typeof labelVariants> & {
    required?: boolean;
  };

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, required = false, ...props }, ref) => (
  <>
    <LabelPrimitive.Root
      ref={ref}
      className={cn(labelVariants(), className)}
      aria-required={required}
      {...props}
    />
    {required && <span className="ml-1 text-red-500 non-sr-only">*</span>}
  </>
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
