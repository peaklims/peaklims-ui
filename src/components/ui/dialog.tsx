import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = ({
  className,
  ...props
}: DialogPrimitive.DialogPortalProps) => (
  <MotionConfig
    transition={{
      type: "spring",
      bounce: 0.3,
      // duration: open ? 0.7 : 0.4
      duration: 0.4,
    }}
  >
    <AnimatePresence mode="wait">
      <DialogPrimitive.Portal className={cn(className)} {...props} />
    </AnimatePresence>
  </MotionConfig>
);
DialogPortal.displayName = DialogPrimitive.Portal.displayName;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay ref={ref} {...props} asChild>
    <motion.div
      variants={{
        isOpen: { opacity: 1 },
        isClosed: { opacity: 0 },
      }}
      className={cn(
        // "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "fixed inset-0 z-50 bg-gray-500 bg-opacity-75",
        className
      )}
    />
  </DialogPrimitive.Overlay>
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <motion.div
      initial="isClosed"
      animate="isOpen"
      exit="isClosed"
      className="z-50"
    >
      <DialogOverlay />
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-end justify-center min-h-full md:items-center md:p-0">
          <DialogPrimitive.Content ref={ref} {...props} asChild>
            <motion.div
              className={cn(
                "fixed pt-12 md:mt-8 pb-4  z-50 w-full mx-2 md:mx-0 md:max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-md bg-white  text-gray-900 shadow",
                "max-md:[--y-isClosed:16px] [--opacity-isClosed:0%] md:[--scale-isClosed:90%]",
                "max-md:[--y-isOpen:0px] [--opacity-isOpen:100%] md:[--scale-isOpen:100%]",
                className
              )}
              variants={{
                isClosed: {
                  y: "var(--y-isClosed, 0)",
                  opacity: "var(--opacity-isClosed)",
                  scale: "var(--scale-isClosed, 1)",
                },
                isOpen: {
                  y: "var(--y-isOpen, 0)",
                  opacity: "var(--opacity-isOpen)",
                  scale: "var(--scale-isOpen, 1)",
                },
              }}
            >
              {children}
              <DialogPrimitive.Close className="absolute right-6 top-6 lg:right-4 lg:top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="w-6 h-6" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            </motion.div>
          </DialogPrimitive.Content>
        </div>
      </div>
    </motion.div>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center md:text-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse md:flex-row md:justify-end md:space-x-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
};
