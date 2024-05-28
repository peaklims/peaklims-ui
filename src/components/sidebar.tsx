"use client";

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { Link, useMatchRoute } from "@tanstack/react-router";
import { LayoutGroup, motion } from "framer-motion";
import { Menu, Sidebar as SidebarIcon } from "lucide-react";
import {
  default as React,
  createContext,
  useContext,
  useId,
  useState,
} from "react";
import { Button } from "./ui/button";

interface SidebarContextResponse {
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContextResponse>(
  {} as SidebarContextResponse
);

interface SidebarProviderProps {
  children: React.ReactNode;
  props?: any;
}

export function SidebarProvider({ props, children }: SidebarProviderProps) {
  const [showSidebar, setShowSidebar] = useState(false);

  const value = {
    showSidebar,
    setShowSidebar,
  };

  return (
    <SidebarContext.Provider value={value} {...props}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (Object.keys(context).length === 0)
    throw new Error("useSidebarContext must be used within a SidebarProvider");
  return context;
}

export const useSidebar = () => {
  return useContext(SidebarContext);
};

export function Sidebar({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"nav">) {
  return <nav {...props} className={cn(className, "flex h-full flex-col")} />;
}

export function SidebarHeader({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      className={cn(
        className,
        "flex flex-col border-b border-zinc-950/5 p-4 dark:border-white/5 [&>[data-slot=section]+[data-slot=section]]:mt-2.5"
      )}
    />
  );
}

export function SidebarBody({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      className={cn(
        className,
        "flex flex-1 flex-col overflow-y-auto p-4 [&>[data-slot=section]+[data-slot=section]]:mt-8"
      )}
    />
  );
}

export function SidebarFooter({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      className={cn(
        className,
        "flex flex-col border-t border-zinc-950/5 p-4 dark:border-white/5 [&>[data-slot=section]+[data-slot=section]]:mt-2.5"
      )}
    />
  );
}

export function SidebarSection({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  let id = useId();

  return (
    <LayoutGroup id={id}>
      <div
        {...props}
        data-slot="section"
        className={cn(className, "flex flex-col gap-0.5")}
      />
    </LayoutGroup>
  );
}

export function SidebarDivider({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"hr">) {
  return (
    <hr
      {...props}
      className={cn(
        "my-4 border-t border-zinc-950/5 lg:-mx-4 dark:border-white/5",
        className
      )}
    />
  );
}

export function SidebarSpacer({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      aria-hidden="true"
      {...props}
      className={cn(className, "mt-8 flex-1")}
    />
  );
}

export function SidebarHeading({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"h3">) {
  return (
    <h3
      {...props}
      className={cn(
        className,
        "mb-1 px-2 text-xs/6 font-medium text-zinc-500 dark:text-zinc-400"
      )}
    />
  );
}

export const SidebarItem = React.forwardRef(function SidebarItem(
  {
    current,
    className,
    children,
    ...props
  }: {
    current?: boolean;
    className?: string;
    children: React.ReactNode;
  } & Omit<React.ComponentPropsWithoutRef<typeof Link>, "type" | "className">, // | Omit<Headless.ButtonProps, "className">
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  let classes = cn(
    // Base
    "flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-base/6 font-medium text-zinc-950 sm:py-2 sm:text-sm/5",
    // Leading icon/icon-only
    " data-[slot=icon]:*:size-6 data-[slot=icon]:*:shrink-0 data-[slot=icon]:*:fill-transparent sm:data-[slot=icon]:*:size-5",
    // Trailing icon (down chevron or similar)
    "data-[slot=icon]:last:*:ml-auto data-[slot=icon]:last:*:size-5 sm:data-[slot=icon]:last:*:size-4",
    // Avatar
    "data-[slot=avatar]:*:-m-0.5 data-[slot=avatar]:*:size-7 data-[slot=avatar]:*:[--ring-opacity:10%] sm:data-[slot=avatar]:*:size-6",
    // Hover
    "hover:bg-zinc-950/5 data-[slot=icon]:*:hover:text-zinc-950",
    // Active
    "data-[active]:bg-zinc-950/5 data-[slot=icon]:*:data-[active]:fill-zinc-950",
    // Current
    "data-[slot=icon]:*:data-[current]:fill-transparent data-[slot=icon]:*:data-[current]:text-emerald-500 data-[current]:text-emerald-500",
    // Dark mode
    "dark:text-white dark:data-[slot=icon]:*:fill-zinc-400",
    "dark:hover:bg-white/5 dark:data-[slot=icon]:*:hover:fill-white",
    "dark:data-[active]:bg-white/5 dark:data-[slot=icon]:*:data-[active]:fill-white",
    "dark:data-[slot=icon]:*:data-[current]:text-white"
  );
  const givenHref = props?.href;
  const matchRoute = useMatchRoute();
  const matchesRoute = matchRoute({
    to: givenHref,
    caseSensitive: false,
    // fuzzy: true,
  });
  const isCurrent = current || matchesRoute;
  const { setShowSidebar } = useSidebarContext();

  return (
    <span className={cn(className, "relative")}>
      {isCurrent && "href" in props && (
        <motion.span
          layoutId="current-indicator"
          className="absolute w-1 rounded-full inset-y-2 -left-4 bg-emerald-500 dark:bg-white"
        />
      )}
      {"href" in props ? (
        <Link
          to={props.href}
          onClick={() => setShowSidebar(false)}
          {...props}
          className={classes}
          data-current={isCurrent ? "true" : undefined}
        >
          <TouchTarget>{children}</TouchTarget>
        </Link>
      ) : (
        <Button
          variant={"ghost"}
          {...props}
          className={cn("cursor-default", classes)}
          data-current={current ? "true" : undefined}
          ref={ref}
        >
          <TouchTarget>{children}</TouchTarget>
        </Button>
      )}
    </span>
  );
});

export function TouchTarget({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span
        className="absolute left-1/2 top-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden"
        aria-hidden="true"
      />
      {children}
    </>
  );
}

export function SidebarLabel({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"span">) {
  return <span {...props} className={cn(className, "truncate")} />;
}

function MobileSidebar({
  isOpen,
  setIsOpen,
  direction,
  children,
}: React.PropsWithChildren<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  direction: "left" | "bottom";
}>) {
  return (
    <div className={direction === "bottom" ? "sm:hidden" : "hidden sm:block"}>
      <Drawer open={isOpen} onOpenChange={setIsOpen} direction={direction}>
        {/* Navbar on mobile */}
        <header className="flex items-center px-4 lg:hidden">
          <div className="py-2.5">
            <button
              onClick={() => setIsOpen(true)}
              aria-label="Open navigation"
            >
              <DrawerTrigger asChild>
                <div
                  className="absolute z-10 block p-1 rounded-full bottom-4 right-4 bg-slate-100 sm:hidden sm:p-2"
                  data-testid="mobile-menu-hamburger"
                >
                  <div className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-slate-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-500">
                    <Menu className="w-6 h-6" aria-hidden="true" />
                  </div>
                </div>
              </DrawerTrigger>

              <DrawerTrigger asChild>
                <div
                  className="hidden p-1 rounded-full cursor-pointer sm:block lg:hidden"
                  data-testid="sidenav-tablet-trigger"
                >
                  <div className="flex items-center justify-center rounded-md text-slate-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-500">
                    <SidebarIcon className="w-5 h-5" aria-hidden="true" />
                  </div>
                </div>
              </DrawerTrigger>
            </button>
          </div>
          {/* <div className="flex-1 min-w-0">{navbar}</div> */}
        </header>

        <DrawerContent
          className={cn(
            // "fixed inset-y-0 w-full p-2 transition w-60",
            "flex w-full flex-1 rounded-t-[10px]",
            direction === "left" && "h-screen w-60 rounded-r-[10px]",
            direction === "bottom" ? "sm:hidden" : "hidden sm:block"
          )}
          overlayClassName={
            direction === "bottom" ? "sm:hidden" : "hidden sm:block"
          }
          showHandle={direction === "bottom" ? true : false}
          side={"center"}
        >
          {children}
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export function SidebarLayout({
  navbar,
  sidebar,
  children,
}: React.PropsWithChildren<{
  navbar: React.ReactNode;
  sidebar: React.ReactNode;
}>) {
  const { showSidebar, setShowSidebar } = useSidebarContext();

  return (
    <div className="relative flex w-full bg-white isolate min-h-svh max-lg:flex-col lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950">
      {/* Sidebar on desktop */}
      <div className="fixed inset-y-0 left-0 w-64 max-lg:hidden">{sidebar}</div>

      {/* Sidebar on mobile */}
      <MobileSidebar
        isOpen={showSidebar}
        setIsOpen={setShowSidebar}
        direction={"bottom"}
      >
        {sidebar}
      </MobileSidebar>

      <MobileSidebar
        isOpen={showSidebar}
        setIsOpen={setShowSidebar}
        direction={"left"}
      >
        {sidebar}
      </MobileSidebar>

      <main className="flex flex-col flex-1 pb-2 lg:min-w-0 lg:pl-64 lg:pr-2 lg:pt-2">
        <div className="p-6 grow lg:rounded-lg lg:bg-white lg:p-8 lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
          {/* <div className="max-w-6xl mx-auto">{children}</div> */}
          <div className="max-w-6xl">{children}</div>
        </div>
      </main>
    </div>
  );
}
