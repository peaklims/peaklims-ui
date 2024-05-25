import logo from "@/assets/logo.svg";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AllRoutesPaths } from "@/router";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  PackageOpen,
  Settings,
  Sidebar,
  UserIcon,
  XIcon,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuthUser } from "@/services/auth";
import { Link, Outlet } from "@tanstack/react-router";
import { useState } from "react";

type NavType = {
  name: string;
  href: AllRoutesPaths;
  icon: React.FC<any>;
};

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Accessioning", href: "/accessions", icon: PackageOpen },
] as NavType[];

export function AuthLayout() {
  return (
    <>
      <div>
        <DesktopMenu />

        <div className="sticky top-0 z-40 flex items-center justify-center px-4 py-2 bg-white shadow-sm gap-x-2 sm:px-6 lg:hidden">
          <Link to="/" className="block">
            <img
              className="w-auto h-6"
              // src="https://tailwindui.com/img/logos/mark.svg?color=emerald&shade=500"
              src={logo}
              alt="Peak LIMS"
            />
          </Link>
          <div className="flex items-center flex-1 px-1 space-x-2 text-sm font-semibold leading-6 text-gray-900">
            <div className="hidden sm:block">
              <MobileMenu direction={"left"} />
            </div>
          </div>
        </div>

        <main className="pt-4 pb-6 lg:pb-10 lg:pl-52 lg:pt-6">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
        <div className="sm:hidden">
          <MobileMenu direction={"bottom"} />
        </div>
      </div>
    </>
  );
}

const sideNavWidth = "lg:w-52";

function DesktopMenu() {
  const { user, logoutUrl } = useAuthUser();
  return (
    <div
      className={cn(
        "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col",
        sideNavWidth
      )}
    >
      <div className="flex flex-col px-6 overflow-y-auto border-r bg-card grow gap-y-5">
        <div className="flex items-center h-16 shrink-0">
          <Link to="/">
            <div className="flex items-center space-x-2">
              <img
                className="w-auto h-6"
                // src="https://tailwindui.com/img/logos/mark.svg?color=emerald&shade=500"
                src={logo}
                alt="Peak LIMS"
              />
            </div>
          </Link>
        </div>
        <nav className="flex flex-col flex-1">
          <ul role="list" className="flex flex-col flex-1 gap-y-4">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      params={{}}
                      className={cn(
                        "border-2 border-transparent hover:text-emerald-400",
                        "group flex gap-x-3 rounded-md px-2 py-1 text-sm font-semibold leading-6",
                        "data-[status=active]:text-emerald-500 data-[status=active]:hover:text-emerald-300"
                      )}
                      activeOptions={{ exact: false }}
                      // activeProps={{
                      //   className:
                      //     "data-[status=active]:border-2 data-[status=active]:border-emerald-500 data-[status=active]:text-emerald-500 data-[status=active]:hover:bg-zinc-100/50",
                      // }}
                    >
                      <item.icon
                        className={cn("h-6 w-6 shrink-0")}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="mt-auto">
              <ProfileManagement user={user} logoutUrl={logoutUrl} />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

function MobileMenu({ direction }: { direction: "left" | "bottom" }) {
  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);
  // const navigate = useNavigate();
  // function navigateAndClose(target: AllRoutesPaths) {
  function navigateAndClose() {
    // navigate({ to: target });
    setMobileMenuIsOpen(false);
  }

  const { user, logoutUrl } = useAuthUser();

  return (
    <Drawer
      open={mobileMenuIsOpen}
      onOpenChange={setMobileMenuIsOpen}
      direction={direction}
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
            <Sidebar className="w-5 h-5" aria-hidden="true" />
          </div>
        </div>
      </DrawerTrigger>

      <DrawerContent
        className={cn(
          "flex w-full flex-1 rounded-t-[10px]",
          direction === "left" && "h-screen w-[50vw] rounded-r-[10px]"
        )}
        side={"center"}
      >
        <div className={cn("flex grow flex-col gap-y-2 overflow-y-auto px-4")}>
          <DrawerHeader className="flex justify-between w-full p-1 space-y-0 shrink-0">
            <Link to="/" className="flex items-center">
              <img
                className="w-auto h-8"
                // src="https://tailwindui.com/img/logos/mark.svg?color=emerald&shade=500"
                src={logo}
                alt="Peak LIMS"
              />
            </Link>
            <DrawerTrigger asChild>
              <button
                onClick={() => setMobileMenuIsOpen(false)}
                className="text-slate-800"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </DrawerTrigger>
          </DrawerHeader>
          <nav className="flex flex-col flex-1">
            <ul role="list" className="flex flex-col flex-1 gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        data-status={
                          item.href === window.location.pathname
                            ? "active"
                            : "inactive"
                        }
                        to={item.href}
                        onClick={() => navigateAndClose()}
                        className={cn(
                          "w-full border-2 border-transparent hover:text-emerald-400",
                          "group flex items-center gap-x-3 rounded-md px-2 py-1 text-sm font-semibold leading-6",
                          "data-[status=active]:text-emerald-500 data-[status=active]:hover:text-emerald-300"
                        )}
                      >
                        <item.icon
                          className={cn("h-6 w-6 shrink-0")}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
          <ProfileManagement user={user} logoutUrl={logoutUrl} />
          <Avatar>
            {/* <AvatarImage src="" alt="" /> */}
            <AvatarFallback>{user.initials}</AvatarFallback>
          </Avatar>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function ProfileManagement({
  user,
  logoutUrl,
}: {
  user: UserType;
  logoutUrl: string | undefined;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <a
          href="#"
          className={
            "flex items-center flex-1 px-1 text-sm font-semibold leading-6 text-gray-900 lg:pr-6 lg:py-3 gap-x-4"
          }
        >
          <Avatar>
            {/* <AvatarImage src={user?.image} /> */}
            <AvatarFallback>{user?.initials}</AvatarFallback>
          </Avatar>
          <span className="sr-only">Your profile</span>
          <span aria-hidden="true" className="inline">
            {user?.name}
          </span>
        </a>
      </DropdownMenuTrigger>

      <DropdownMenuContent className={cn("rounded-b-none", sideNavWidth)}>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {logoutUrl && (
          <>
            <a href={logoutUrl}>
              <DropdownMenuItem className="cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                <span>Log out</span>
                {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
              </DropdownMenuItem>
            </a>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuGroup>
          <DropdownMenuItem disabled>
            <UserIcon className="w-4 h-4 mr-2" />
            <span>Profile</span>
            {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Settings className="w-4 h-4 mr-2" />
            <span>Settings</span>
            {/* <DropdownMenuShortcut>⌘S</DropdownMenuShortcut> */}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
