import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";

import { cn } from "@/lib/utils";

const VerticalTabs = TabsPrimitive.Root;

const VerticalTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      // "max-h-[20rem] w-full sm:max-h-full flex border-emerald-500 border items-center justify-start rounded-md bg-muted px-4 py-1 text-muted-foreground overflow-y-auto space-y-2",
      "-mb-px flex space-x-8 px-3",
      className
    )}
    {...props}
  />
));
VerticalTabsList.displayName = TabsPrimitive.List.displayName;

const VerticalTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      // "w-full inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-3 sm:py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",

      "data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-600",
      "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
      "group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium",
      className
    )}
    {...props}
  />
));
VerticalTabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const VerticalTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "w-full ring-offset-background rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
VerticalTabsContent.displayName = TabsPrimitive.Content.displayName;

export {
  VerticalTabs,
  VerticalTabsContent,
  VerticalTabsList,
  VerticalTabsTrigger,
};
