import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { User as UserType, useAuthUser } from "@/services/auth";
import {
  Link,
  Outlet,
  RegisteredRoutesInfo,
  useNavigate,
} from "@tanstack/react-router";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  PackageOpen,
  Settings,
  User as UserIcon,
} from "lucide-react";
import { useState } from "react";

type NavType = {
  name: string;
  href: RegisteredRoutesInfo["routePaths"];
  icon: React.FC<any>;
};

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Accessioning", href: "/accessions", icon: PackageOpen },
] as NavType[];
const teams = [
  // { id: 1, name: "Heroicons", href: "#", initial: "H" },
  // { id: 2, name: "Tailwind Labs", href: "#", initial: "T" },
  // { id: 3, name: "Workcation", href: "#", initial: "W" },
];

export default function AuthLayout() {
  const { user, logoutUrl, isLoading } = useAuthUser();
  if (isLoading) return <Loading />;

  return (
    <>
      <div>
        <DesktopMenu user={user} logoutUrl={logoutUrl} />

        <div className="sticky top-0 z-40 flex items-center px-4 py-4 shadow-sm bg-background gap-x-6 sm:px-6 lg:hidden">
          <div className="flex-1 text-sm font-semibold leading-6 text-primary">
            Peak LIMS
          </div>

          <ProfileManagement user={user} logoutUrl={logoutUrl} />
        </div>

        <main className="pt-4 pb-6 md:pt-6 md:pb-10 lg:pl-52">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>

        <MobileMenu />
      </div>
    </>
  );
}

function MobileMenu() {
  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);
  const navigate = useNavigate();
  function navigateAndClose(target: RegisteredRoutesInfo["routePaths"]) {
    navigate({ to: target });
    setMobileMenuIsOpen(false);
  }

  return (
    <Dialog open={mobileMenuIsOpen} onOpenChange={setMobileMenuIsOpen}>
      <div className="relative inset-0 flex">
        <DialogContent className="relative flex flex-1 w-full">
          <div className="flex flex-col px-6 pb-2 overflow-y-auto grow gap-y-5 min-h-[30vh]">
            <div className="flex items-center h-16 shrink-0">
              <img
                className="w-auto h-8"
                src="https://tailwindui.com/img/logos/mark.svg?color=emerald&shade=500"
                alt="Your Company"
              />
            </div>
            <nav className="flex flex-col flex-1">
              <ul role="list" className="flex flex-col flex-1 gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <button
                          data-status={
                            item.href === window.location.pathname
                              ? "active"
                              : "inactive"
                          }
                          onClick={() => navigateAndClose(item.href)}
                          className={cn(
                            "w-full text-secondary-foreground hover:text-primary/80 hover:bg-gray-50 py-3",
                            "group flex gap-x-3 rounded-md px-2 text-sm leading-6 font-semibold",
                            "data-[status=active]:bg-card data-[status=active]:text-primary data-[status=active]:hover:bg-secondary/50"
                          )}
                        >
                          <item.icon
                            className={cn("h-6 w-6 shrink-0")}
                            aria-hidden="true"
                          />
                          {item.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
                {/* <li>
                  <div className="text-xs font-semibold leading-6 text-gray-400">
                    Your teams
                  </div>
                  <ul role="list" className="mt-2 -mx-2 space-y-1">
                    {teams.map((team) => (
                      <li key={team.name}>
                        <Link
                          to={team.href}
                          className={cn(
                            team.current
                              ? "bg-gray-50 text-foreground"
                              : "text-gray-700 hover:text-foreground hover:bg-gray-50",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                          )}
                        >
                          <span
                            className={cn(
                              team.current
                                ? "text-foreground border-foreground"
                                : "text-gray-400 border-gray-200 group-hover:border-foreground group-hover:text-foreground",
                              "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white"
                            )}
                          >
                            {team.initial}
                          </span>
                          <span className="truncate">{team.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li> */}
              </ul>
            </nav>
          </div>
        </DialogContent>
      </div>

      <DialogTrigger>
        <div className="absolute z-10 p-1 rounded-full bottom-4 right-4 bg-slate-100 sm:p-2 lg:hidden">
          <div className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-slate-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-500">
            <Menu className="w-6 h-6" aria-hidden="true" />
          </div>
        </div>
      </DialogTrigger>
    </Dialog>
  );
}

const sideNavWidth = "lg:w-52";

function DesktopMenu({
  user,
  logoutUrl,
}: {
  user: UserType;
  logoutUrl: string | undefined;
}) {
  return (
    <div
      className={cn(
        "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col",
        sideNavWidth
      )}
    >
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div className="flex flex-col px-6 overflow-y-auto border-r bg-card grow gap-y-5">
        <div className="flex items-center h-16 shrink-0">
          <img
            className="w-auto h-8"
            src="https://tailwindui.com/img/logos/mark.svg?color=emerald&shade=500"
            alt="Your Company"
          />
        </div>
        <nav className="flex flex-col flex-1">
          <ul role="list" className="flex flex-col flex-1 gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        "text-secondary-foreground hover:text-primary/80 hover:bg-gray-50",
                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                        "data-[status=active]:bg-card data-[status=active]:text-primary data-[status=active]:hover:bg-secondary/50"
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
            {/* <li>
              <div className="text-xs font-semibold leading-6 text-gray-400">
                Your teams
              </div>
              <ul role="list" className="mt-2 -mx-2 space-y-1">
                {teams.map((team) => (
                  <li key={team.name}>
                    <Link
                      to={team.href}
                      className={cn(
                        team.current
                          ? "bg-gray-50 text-foreground"
                          : "text-gray-700 hover:text-foreground hover:bg-gray-50",
                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                      )}
                    >
                      <span
                        className={cn(
                          team.current
                            ? "text-foreground border-foreground"
                            : "text-gray-400 border-gray-200 group-hover:border-foreground group-hover:text-foreground",
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white"
                        )}
                      >
                        {team.initial}
                      </span>
                      <span className="truncate">{team.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li> */}
            <li className="mt-auto">
              <ProfileManagement user={user} logoutUrl={logoutUrl} />
            </li>
          </ul>
        </nav>
      </div>
    </div>
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
          <span className="hidden sr-only lg:inline">Your profile</span>
          <span aria-hidden="true" className="hidden lg:inline">
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

function Loading() {
  return (
    <div className="flex items-center justify-center w-screen h-screen transition-all bg-slate-100">
      <svg
        className="w-6 h-6 animate-spin text-slate-800"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx={12}
          cy={12}
          r={10}
          stroke="currentColor"
          strokeWidth={4}
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
}
