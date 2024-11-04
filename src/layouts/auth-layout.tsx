import logo from "@/assets/logo-with-name.svg";
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
import { useGetUserPeakOrganization } from "@/domain/peak-organizations/apis/get-peak-organization";
import { SelectQuickActionButton } from "@/domain/quick-actions/select-quick-action-button";
import { useActionButtonKey } from "@/hooks";
import { cn } from "@/lib/utils";
import { useAuthUser } from "@/services/auth";
import { Tooltip } from "@nextui-org/react";
import {
  Link,
  RegisteredRoutesInfo,
  useNavigate,
} from "@tanstack/react-router";
import {
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
        <div
          className={
            "flex items-center flex-1 px-1 text-sm font-semibold leading-6 text-gray-900 lg:pr-6 lg:py-1 gap-x-4 hover:bg-slate-200 rounded-lg overflow-hidden text-ellipsis"
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
          </div>
        </div>
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

export function AuthLayout({ children }: { children: React.ReactNode }) {
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

  const { data: organizationInfo, isLoading: isLoadingOrganizationInfo } =
    useGetUserPeakOrganization({
      hasArtificialDelay: true,
      delayInMs: 400,
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
              <div className="flex items-center justify-center pt-2 text-xs font-semibold text-center uppercase ">
                {isLoadingOrganizationInfo ? (
                  <div className="w-3/4 h-2 rounded-full bg-input" />
                ) : (
                  <>{organizationInfo?.name}</>
                )}
              </div>
            </SidebarHeader>
            <SidebarBody>
              {/* <SidebarSection className="-mt-3">
              </SidebarSection> */}
              {/* <SidebarDivider className="my-1" /> */}
              <SidebarSection className="min-h-[25svh]">
                {/* <Tooltip
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
                </Tooltip> */}
                <SidebarItem href="/receiving">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={200}
                    height={200}
                    viewBox="0 0 24 24"
                    data-slot="icon"
                  >
                    <g
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    >
                      <path d="M16 6.25v9.51c-.12.149-.217.314-.29.49H8.29a2.5 2.5 0 0 0-4.58 0H3a1 1 0 0 1-1-1v-9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2m6 7.11v2.89h-1.71a2.49 2.49 0 0 0-4.29-.49V7.25h2.43a1 1 0 0 1 .86.49l.91 1.51l1.23 2.05a4 4 0 0 1 .57 2.06" />
                      <path d="M8.5 17.25a2.5 2.5 0 1 1-4.79-1a2.5 2.5 0 0 1 4.79 1m12 0a2.5 2.5 0 1 1-4.79-1c.073-.176.17-.341.29-.49a2.49 2.49 0 0 1 4.29.49c.14.315.212.656.21 1m-9.5-6H6m5-3H6" />
                    </g>
                  </svg>
                  <SidebarLabel>Receiving</SidebarLabel>
                </SidebarItem>
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
                <SidebarItem href="/runs">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={200}
                    height={200}
                    viewBox="0 0 24 24"
                    data-slot="icon"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      d="M18.218 1H23v18H1V1h5m11 9c-4-3-6 3-10 0M5 23h14H5Zm5-22v4.773l-5 7.182V15h14v-2.045l-5-7.182V1M8 1h8h-8Zm0 22h8v-4H8v4Z"
                    />
                  </svg>

                  <SidebarLabel>Runs</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="/reporting">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={200}
                    height={200}
                    viewBox="0 0 24 24"
                    data-slot="icon"
                  >
                    <g
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    >
                      <path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5.697M18 12V7a2 2 0 0 0-2-2h-2" />
                      <path d="M8 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2zm0 6h4m-4 4h3m3 2.5a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0m4.5 2L21 22" />
                    </g>
                  </svg>
                  <SidebarLabel>Reporting</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="/queue">
                  <svg
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    data-slot="icon"
                  >
                    <path
                      d="M20.2702 7.79619L16.6593 9.67155L12.2679 11.908C12.1861 11.9539 12.0938 11.978 12 11.978C11.9062 11.978 11.8139 11.9539 11.7321 11.908L7.34072 9.67155L3.72978 7.79619C3.63181 7.74658 3.54951 7.67079 3.49201 7.57723C3.43451 7.48367 3.40408 7.37601 3.40408 7.26619C3.40408 7.15638 3.43451 7.04872 3.49201 6.95516C3.54951 6.8616 3.63181 6.78581 3.72978 6.7362L11.7437 2.81076C11.8233 2.77081 11.911 2.75 12 2.75C12.089 2.75 12.1767 2.77081 12.2563 2.81076L20.2702 6.7362C20.3682 6.78581 20.4505 6.8616 20.508 6.95516C20.5655 7.04872 20.5959 7.15638 20.5959 7.26619C20.5959 7.37601 20.5655 7.48367 20.508 7.57723C20.4505 7.67079 20.3682 7.74658 20.2702 7.79619Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.34079 9.67154L3.72985 11.3955C3.63188 11.4451 3.54958 11.5209 3.49208 11.6144C3.43458 11.708 3.40415 11.8156 3.40415 11.9255C3.40415 12.0353 3.43458 12.1429 3.49208 12.2365C3.54958 12.3301 3.63188 12.4059 3.72985 12.4555L7.34079 14.3308L11.7322 16.5673C11.814 16.6132 11.9062 16.6373 12.0001 16.6373C12.0939 16.6373 12.1862 16.6132 12.268 16.5673L16.6593 14.3308L20.2703 12.4555C20.357 12.4024 20.4287 12.3279 20.4784 12.2392C20.5281 12.1505 20.5542 12.0505 20.5542 11.9488C20.5542 11.8471 20.5281 11.7471 20.4784 11.6583C20.4287 11.5696 20.357 11.4952 20.2703 11.4421L16.6593 9.67154"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.34079 14.3308L3.72985 16.0548C3.63188 16.1044 3.54958 16.1802 3.49208 16.2737C3.43458 16.3673 3.40415 16.475 3.40415 16.5848C3.40415 16.6946 3.43458 16.8022 3.49208 16.8958C3.54958 16.9894 3.63188 17.0652 3.72985 17.1148L11.7322 21.18C11.814 21.2259 11.9062 21.25 12.0001 21.25C12.0939 21.25 12.1862 21.2259 12.268 21.18L20.2703 17.1148C20.357 17.0617 20.4287 16.9872 20.4784 16.8985C20.5281 16.8098 20.5542 16.7098 20.5542 16.6081C20.5542 16.5064 20.5281 16.4064 20.4784 16.3176C20.4287 16.2289 20.357 16.1545 20.2703 16.1014L16.6593 14.3308"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <SidebarLabel>Queue</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="/settings">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={200}
                    height={200}
                    viewBox="0 0 24 24"
                    data-slot="icon"
                  >
                    <g
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    >
                      <path d="M12.132 15.404a3.364 3.364 0 1 0 0-6.728a3.364 3.364 0 0 0 0 6.728" />
                      <path d="M20.983 15.094a9.43 9.43 0 0 1-1.802 3.1l-2.124-.482a7.245 7.245 0 0 1-2.801 1.56l-.574 2.079a9.462 9.462 0 0 1-1.63.149a9.117 9.117 0 0 1-2.032-.23l-.609-2.146a7.475 7.475 0 0 1-2.457-1.493l-2.1.54a9.357 9.357 0 0 1-1.837-3.33l1.55-1.722a7.186 7.186 0 0 1 .069-2.652L3.107 8.872a9.356 9.356 0 0 1 2.067-3.353l2.17.54A7.68 7.68 0 0 1 9.319 4.91l.574-2.124a8.886 8.886 0 0 1 2.17-.287c.585 0 1.17.054 1.745.16l.551 2.113c.83.269 1.608.68 2.296 1.217l2.182-.563a9.368 9.368 0 0 1 2.043 3.1l-1.48 1.607a7.405 7.405 0 0 1 .068 3.364z" />
                    </g>
                  </svg>
                  <SidebarLabel>Settings</SidebarLabel>
                </SidebarItem>
              </SidebarSection>
              <SidebarSection className="max-lg:hidden">
                <SidebarHeading>Runs Processing</SidebarHeading>
                <SidebarItem href="/run/1">R68329201</SidebarItem>
                <SidebarItem href="/run/2">R68329222</SidebarItem>
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
        {children}
      </SidebarLayout>
    </SidebarProvider>
  );
}
