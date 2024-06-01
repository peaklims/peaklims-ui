import logo from "@/assets/logo.svg";
import { Kbd, TooltipHotkey } from "@/components";
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarLayout,
  SidebarProvider,
  SidebarSection,
  SidebarSpacer,
} from "@/components/sidebar";
import { CreateNew, Lightbulb } from "@/components/svgs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SelectQuickActionButton } from "@/domain/quick-actions/select-quick-action-button";
import { useActionButtonKey } from "@/hooks";
import { cn } from "@/lib/utils";
import { useAuthUser } from "@/services/auth";
import { Tooltip } from "@nextui-org/react";
import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import {
  HomeIcon,
  LogOut,
  MailQuestion,
  PackageOpen,
  SearchIcon,
  Settings,
  UserIcon,
} from "lucide-react";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

const sideNavWidth = "lg:w-52";
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
            "flex items-center flex-1 px-1 text-sm font-semibold leading-6 text-gray-900 lg:pr-6 lg:py-1 gap-x-4"
          }
        >
          <Avatar>
            {/* <AvatarImage src={user?.image} /> */}
            <AvatarFallback>{user?.initials}</AvatarFallback>
          </Avatar>
          <div className="inline-flex flex-col items-start">
            <span className="sr-only">Your profile</span>
            <span aria-hidden="true" className="inline">
              {user?.name}
            </span>
            <span
              aria-hidden="true"
              className="inline text-xs font-normal text-slate-500"
            >
              {user?.email}
            </span>
          </div>
        </a>
      </DropdownMenuTrigger>

      <DropdownMenuContent className={cn("rounded-b-none", sideNavWidth)}>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {logoutUrl && (
          <>
            <a href={logoutUrl}>
              <DropdownMenuItem className="cursor-pointer">
                <LogOut className="w-4.5 h-4.5 mr-2" />
                <span>Log out</span>
                {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
              </DropdownMenuItem>
            </a>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuGroup>
          <DropdownMenuItem disabled>
            <UserIcon className="w-4.5 h-4.5 mr-2" />
            <span>Profile</span>
            {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Settings className="w-4.5 h-4.5 mr-2" />
            <span>Settings</span>
            {/* <DropdownMenuShortcut>⌘S</DropdownMenuShortcut> */}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AuthLayout() {
  const { user, logoutUrl } = useAuthUser();
  const [quickActionIsOpen, setQuickActionIsOpen] = useState(false);

  const navigate = useNavigate();
  useHotkeys("g+a", () => {
    navigate({
      to: `/accessions` as RegisteredRoutesInfo["routePaths"],
    });
  });
  useHotkeys("g+h", () => {
    navigate({
      to: `/` as RegisteredRoutesInfo["routePaths"],
    });
  });
  useHotkeys("q", () => {
    setQuickActionIsOpen(true);
  });
  const actionKey = useActionButtonKey();
  useHotkeys(`meta+k`, () => {
    alert("search");
  });

  return (
    <SidebarProvider>
      <SidebarLayout
        navbar={<></>}
        sidebar={
          <Sidebar>
            <SidebarHeader className="px-4 py-2">
              <div className="flex items-center justify-between">
                <Link to="/">
                  <div className="flex items-center flex-1 space-x-3">
                    <img
                      className="w-auto h-6"
                      // src="https://tailwindui.com/img/logos/mark.svg?color=emerald&shade=500"
                      src={logo}
                      alt="Peak LIMS"
                    />
                    <p className="text-sm font-medium">Peak LIMS</p>
                  </div>
                </Link>

                <div className="flex items-center justify-end">
                  <Tooltip
                    placement="bottom"
                    closeDelay={0}
                    delay={600}
                    content={
                      <TooltipHotkey>
                        Quick search with <Kbd command={`${actionKey}K`} />
                      </TooltipHotkey>
                    }
                  >
                    <SidebarItem onClick={() => alert("search")}>
                      <SearchIcon className="w-4.5 h-4.5" />
                      <SidebarLabel className="sr-only">Search</SidebarLabel>
                    </SidebarItem>
                  </Tooltip>

                  <SelectQuickActionButton
                    isOpen={quickActionIsOpen}
                    setIsOpen={setQuickActionIsOpen}
                  >
                    <Tooltip
                      placement="bottom"
                      closeDelay={0}
                      delay={600}
                      content={
                        <TooltipHotkey>
                          Perform quick actions with <Kbd command={"Q"} />
                        </TooltipHotkey>
                      }
                    >
                      <SidebarItem onClick={() => setQuickActionIsOpen(true)}>
                        <SidebarLabel className="sr-only">
                          Quick Add
                        </SidebarLabel>
                        <CreateNew className="w-4.5 h-4.5" />
                      </SidebarItem>
                    </Tooltip>
                  </SelectQuickActionButton>
                </div>
              </div>
            </SidebarHeader>
            <SidebarBody>
              {/* <SidebarSection className="-mt-3">
              </SidebarSection> */}
              {/* <SidebarDivider className="my-1" /> */}
              <SidebarSection className="min-h-[25svh]">
                <Tooltip
                  placement="right"
                  closeDelay={0}
                  delay={600}
                  content={
                    <TooltipHotkey>
                      Accessioning <Kbd command={"G"} /> then{" "}
                      <Kbd command={"h"} />
                    </TooltipHotkey>
                  }
                >
                  <SidebarItem href="/">
                    <HomeIcon data-slot="icon" />
                    <SidebarLabel>Home</SidebarLabel>
                  </SidebarItem>
                </Tooltip>
                <Tooltip
                  placement="right"
                  closeDelay={0}
                  delay={600}
                  content={
                    <TooltipHotkey>
                      Accessioning <Kbd command={"G"} /> then{" "}
                      <Kbd command={"A"} />
                    </TooltipHotkey>
                  }
                >
                  <SidebarItem href="/accessions">
                    <PackageOpen data-slot="icon" />
                    <SidebarLabel>Accessioning</SidebarLabel>
                  </SidebarItem>
                </Tooltip>
              </SidebarSection>
              <SidebarSection className="max-lg:hidden">
                <SidebarHeading>Upcoming Events</SidebarHeading>
                <SidebarItem href="/events/1">
                  Bear Hug: Live in Concert
                </SidebarItem>
                <SidebarItem href="/events/2">Viking People</SidebarItem>
                <SidebarItem href="/events/3">Six Fingers — DJ Set</SidebarItem>
                <SidebarItem href="/events/4">We All Look The Same</SidebarItem>
              </SidebarSection>
              <SidebarSpacer />
              <SidebarSection>
                <SidebarItem href="/support">
                  <MailQuestion data-slot="icon" />
                  <SidebarLabel>Support</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="/share-feedback">
                  <Lightbulb data-slot="icon" />
                  <SidebarLabel>Share Feedback</SidebarLabel>
                </SidebarItem>
                {/* <SidebarItem href="/changelog">
                <SparklesIcon />
                <SidebarLabel>Changelog</SidebarLabel>
              </SidebarItem> */}
              </SidebarSection>
            </SidebarBody>
            <SidebarFooter className="max-lg:hidden">
              <ProfileManagement user={user} logoutUrl={logoutUrl} />
              {/* <Dropdown>
              <DropdownButton as={SidebarItem}>
                <span className="flex items-center min-w-0 gap-3">
                  <Avatar src="/profile-photo.jpg" className="size-10" square alt="" />
                  <span className="min-w-0">
                    <span className="block font-medium truncate text-sm/5 text-zinc-950 dark:text-white">Erica</span>
                    <span className="block font-normal truncate text-xs/5 text-zinc-500 dark:text-zinc-400">
                      erica@example.com
                    </span>
                  </span>
                </span>
                <ChevronUpIcon />
              </DropdownButton>
              <DropdownMenu className="min-w-64" anchor="top start">
                <DropdownItem href="/my-profile">
                  <UserIcon />
                  <DropdownLabel>My profile</DropdownLabel>
                </DropdownItem>
                <DropdownItem href="/settings">
                  <Cog8ToothIcon />
                  <DropdownLabel>Settings</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href="/privacy-policy">
                  <ShieldCheckIcon />
                  <DropdownLabel>Privacy policy</DropdownLabel>
                </DropdownItem>
                <DropdownItem href="/share-feedback">
                  <LightBulbIcon />
                  <DropdownLabel>Share feedback</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href="/logout">
                  <ArrowRightStartOnRectangleIcon />
                  <DropdownLabel>Sign out</DropdownLabel>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown> */}
            </SidebarFooter>
          </Sidebar>
        }
      >
        <Outlet />
      </SidebarLayout>
    </SidebarProvider>
  );
}
