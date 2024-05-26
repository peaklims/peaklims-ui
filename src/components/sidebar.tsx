"use client";

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { Link, useMatchRoute } from "@tanstack/react-router";
import clsx from "clsx";
import { LayoutGroup, motion } from "framer-motion";
import { Menu, Sidebar as SidebarIcon } from "lucide-react";
import { default as React, useId, useState } from "react";
import { Button } from "./ui/button";

export function Sidebar({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"nav">) {
  return <nav {...props} className={clsx(className, "flex h-full flex-col")} />;
}

export function SidebarHeader({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      className={clsx(
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
      className={clsx(
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
      className={clsx(
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
        className={clsx(className, "flex flex-col gap-0.5")}
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
      className={clsx(
        className,
        "my-4 border-t border-zinc-950/5 lg:-mx-4 dark:border-white/5"
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
      className={clsx(className, "mt-8 flex-1")}
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
      className={clsx(
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
  let classes = clsx(
    // Base
    "flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-base/6 font-medium text-zinc-950 sm:py-2 sm:text-sm/5",
    // Leading icon/icon-only
    "data-[slot=icon]:*:size-6 data-[slot=icon]:*:shrink-0 data-[slot=icon]:*:fill-transparent sm:data-[slot=icon]:*:size-5",
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

  return (
    <span className={clsx(className, "relative")}>
      {isCurrent && (
        <motion.span
          layoutId="current-indicator"
          className="absolute w-1 rounded-full inset-y-2 -left-4 bg-emerald-500 dark:bg-white"
        />
      )}
      {"href" in props ? (
        <Link
          to={props.href}
          {...props}
          className={classes}
          data-current={isCurrent ? "true" : undefined}
        >
          <TouchTarget>{children}</TouchTarget>
        </Link>
      ) : (
        <Button
          {...props}
          className={clsx("cursor-default", classes)}
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
  return <span {...props} className={clsx(className, "truncate")} />;
}

function OpenMenuIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M2 6.75C2 6.33579 2.33579 6 2.75 6H17.25C17.6642 6 18 6.33579 18 6.75C18 7.16421 17.6642 7.5 17.25 7.5H2.75C2.33579 7.5 2 7.16421 2 6.75ZM2 13.25C2 12.8358 2.33579 12.5 2.75 12.5H17.25C17.6642 12.5 18 12.8358 18 13.25C18 13.6642 17.6642 14 17.25 14H2.75C2.33579 14 2 13.6642 2 13.25Z" />
    </svg>
  );
}

function CloseMenuIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  );
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
  // const navigate = useNavigate();
  // function navigateAndClose(target: AllRoutesPaths) {
  function navigateAndClose() {
    // navigate({ to: target });
    close();
  }
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
            // "fixed inset-y-0 w-full p-2 transition max-w-80",
            "flex w-full flex-1 rounded-t-[10px]",
            direction === "left" && "h-screen max-w-80 rounded-r-[10px]",
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

// function MobileMenu({ direction }: { direction: "left" | "bottom" }) {
//   const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);
//   // const navigate = useNavigate();
//   // function navigateAndClose(target: AllRoutesPaths) {
//   function navigateAndClose() {
//     // navigate({ to: target });
//     setMobileMenuIsOpen(false);
//   }

//   const { user, logoutUrl } = useAuthUser();

//   return (
//     <Drawer
//       open={mobileMenuIsOpen}
//       onOpenChange={setMobileMenuIsOpen}
//       direction={direction}
//     >
//       <DrawerTrigger asChild>
//         <div
//           className="absolute z-10 block p-1 rounded-full bottom-4 right-4 bg-slate-100 sm:hidden sm:p-2"
//           data-testid="mobile-menu-hamburger"
//         >
//           <div className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-slate-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-500">
//             <Menu className="w-6 h-6" aria-hidden="true" />
//           </div>
//         </div>
//       </DrawerTrigger>

//       <DrawerTrigger asChild>
//         <div
//           className="hidden p-1 rounded-full cursor-pointer sm:block lg:hidden"
//           data-testid="sidenav-tablet-trigger"
//         >
//           <div className="flex items-center justify-center rounded-md text-slate-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-500">
//             <Sidebar className="w-5 h-5" aria-hidden="true" />
//           </div>
//         </div>
//       </DrawerTrigger>

//       <DrawerContent
//         className={cn(
//           "flex w-full flex-1 rounded-t-[10px]",
//           direction === "left" && "h-screen w-[50vw] rounded-r-[10px]"
//         )}
//         side={"center"}
//       >
//         <div className={cn("flex grow flex-col gap-y-2 overflow-y-auto px-4")}>
//           <DrawerHeader className="flex justify-between w-full p-1 space-y-0 shrink-0">
//             <Link to="/" className="flex items-center">
//               <img
//                 className="w-auto h-8"
//                 // src="https://tailwindui.com/img/logos/mark.svg?color=emerald&shade=500"
//                 src={logo}
//                 alt="Peak LIMS"
//               />
//             </Link>
//             <DrawerTrigger asChild>
//               <button
//                 onClick={() => setMobileMenuIsOpen(false)}
//                 className="text-slate-800"
//               >
//                 <XIcon className="w-5 h-5" />
//               </button>
//             </DrawerTrigger>
//           </DrawerHeader>
//           <nav className="flex flex-col flex-1">
//             <ul role="list" className="flex flex-col flex-1 gap-y-7">
//               <li>
//                 <ul role="list" className="-mx-2 space-y-1">
//                   {navigation.map((item) => (
//                     <li key={item.name}>
//                       <Link
//                         data-status={
//                           item.href === window.location.pathname
//                             ? "active"
//                             : "inactive"
//                         }
//                         to={item.href}
//                         onClick={() => navigateAndClose()}
//                         className={cn(
//                           "w-full border-2 border-transparent hover:text-emerald-400",
//                           "group flex items-center gap-x-3 rounded-md px-2 py-1 text-sm font-semibold leading-6",
//                           "data-[status=active]:text-emerald-500 data-[status=active]:hover:text-emerald-300"
//                         )}
//                       >
//                         <item.icon
//                           className={cn("h-6 w-6 shrink-0")}
//                           aria-hidden="true"
//                         />
//                         {item.name}
//                       </Link>
//                     </li>
//                   ))}
//                 </ul>
//               </li>
//             </ul>
//           </nav>
//           <ProfileManagement user={user} logoutUrl={logoutUrl} />
//           <Avatar>
//             {/* <AvatarImage src="" alt="" /> */}
//             <AvatarFallback>{user.initials}</AvatarFallback>
//           </Avatar>
//         </div>
//       </DrawerContent>
//     </Drawer>
//   );
// }

export function SidebarLayout({
  navbar,
  sidebar,
  children,
}: React.PropsWithChildren<{
  navbar: React.ReactNode;
  sidebar: React.ReactNode;
}>) {
  let [showSidebar, setShowSidebar] = useState(false);

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

      {/* Navbar on mobile */}
      {/* <header className="flex items-center px-4 lg:hidden">
        <div className="py-2.5">
          <button
            onClick={() => setShowSidebar(true)}
            aria-label="Open navigation"
          >
            <OpenMenuIcon />
          </button>
        </div>
        <div className="flex-1 min-w-0">{navbar}</div>
      </header> */}
      {/* Content */}
      <main className="flex flex-col flex-1 pb-2 lg:min-w-0 lg:pl-64 lg:pr-2 lg:pt-2">
        <div className="p-6 grow lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
          <div className="max-w-6xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
