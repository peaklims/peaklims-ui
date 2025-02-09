import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import * as React from "react";
import * as CheckboxPrimitive from "react-aria-components";

export type CheckboxProps = Omit<
  CheckboxPrimitive.CheckboxProps,
  "children"
> & {
  children?: React.ReactNode;
  className?: string;
};

export const Checkbox = React.forwardRef<HTMLLabelElement, CheckboxProps>(
  ({ className, children, ...props }, ref) => {
    var tickVariants = {
      checked: {
        pathLength: 1,
        opacity: 1,
        transition: {
          duration: 0.2,
          delay: 0.1,
        },
      },
      unchecked: {
        pathLength: 0,
        opacity: 0,
        transition: {
          duration: 0.2,
        },
      },
    };

    return (
      <CheckboxPrimitive.Checkbox
        ref={ref}
        className={cn(
          "font-sm group flex items-center justify-center text-gray-500",
          className,
          props.isDisabled && "cursor-not-allowed"
        )}
        {...props}
      >
        {({ isSelected, isIndeterminate, defaultChildren }) => (
          <>
            <div
              className={cn(
                "flex h-[1.143rem] w-[1.143rem] items-center justify-center rounded border-2 border-gray-300 text-white transition-all",
                "group-data-[focus-visible=true]:ring group-data-[focus-visible=true]:ring-emerald-500 group-data-[focus-visible=true]:ring-offset-1",
                "group-data-[selected=true]:border-emerald-500 group-data-[selected=true]:bg-emerald-500",
                "group-data-[indeterminate=true]:border-emerald-500 group-data-[indeterminate=true]:bg-emerald-500",
                !props.isReadOnly &&
                  !props.isDisabled &&
                  "hover:border-gray-400",
                props.isReadOnly && "pointer-events-none opacity-70",
                props.isDisabled &&
                  "opacity-70 group-data-[selected=true]:border-slate-500/50 group-data-[selected=true]:bg-slate-500/70 group-data-[selected=true]:text-slate-200"
              )}
            >
              {/* Check / Indeterminate icons */}
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="3.5"
                stroke="currentColor"
                className={cn(
                  "h-3 w-3",
                  !isSelected && !isIndeterminate && "hidden"
                )}
                initial={isSelected}
                animate={isSelected ? "checked" : "unchecked"}
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                  variants={tickVariants}
                />
              </motion.svg>

              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                width={200}
                height={200}
                viewBox="0 0 16 16"
                className={cn("h-3 w-3", !isIndeterminate && "hidden")}
                initial={isIndeterminate}
                animate={isIndeterminate ? "checked" : "unchecked"}
              >
                <motion.path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M2 8a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 8Z"
                  clipRule="evenodd"
                />
              </motion.svg>
            </div>

            {/* Render *either* your own children *or* the library's default children */}
            {children ?? defaultChildren}
          </>
        )}
      </CheckboxPrimitive.Checkbox>
    );
  }
);

Checkbox.displayName = "Checkbox";
