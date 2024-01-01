import { Notification } from "@/components/notifications";
import AuthLayout from "@/layouts/auth-layout";
import { ReactQueryDevtools, TanStackRouterDevtools } from "@/lib/dev-tools";
import { siteConfig } from "@/lib/site-config";
import { AccessionWorklistPage } from "@/pages/accessions";
import { EditAccessionPage } from "@/pages/accessions/edit-accession-page";
import { IndexPage } from "@/pages/dashboard";
import {
  Outlet,
  RegisteredRoutesInfo,
  RootRoute,
  Route,
  Router,
} from "@tanstack/react-router";
import { Helmet } from "react-helmet";
import { z } from "zod";

const appRoute = new RootRoute({
  component: () => {
    return (
      <>
        <Helmet
          titleTemplate={`%s | ${siteConfig.name}`}
          defaultTitle={siteConfig.name}
        >
          {/* <meta name="description" content={siteConfig.description} />
          <meta name="authhor" content="bachiitter" />
          <link rel="author" href="https://bachitter.dev" />

          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="Shoubhit Dash" />
          <meta property="og:url" content={siteConfig.url} />
          <meta property="og:title" content={siteConfig.name} />
          <meta property="og:description" content={siteConfig.name} />
          <meta property="og:image" content={siteConfig.ogImage} />

          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content={siteConfig.url} />
          <meta property="twitter:title" content={siteConfig.name} />
          <meta
            property="twitter:description"
            content={siteConfig.description}
          />
          <meta property="twitter:image" content={siteConfig.ogImage} /> */}
        </Helmet>

        <div className="h-full min-h-screen font-sans antialiased scroll-smooth debug-screens [font-feature-settings:'ss01'] ">
          <Outlet />
          <Notification />
          <div className="hidden md:block">
            <TanStackRouterDevtools
              position="top-right"
              toggleButtonProps={{
                style: {
                  marginRight: "5rem",
                  marginTop: "1.25rem",
                },
              }}
            />
            <ReactQueryDevtools buttonPosition="top-right" />
          </div>
          <div className="block md:hidden">
            <TanStackRouterDevtools
              position="bottom-left"
              toggleButtonProps={{
                style: {
                  // marginLeft: "5rem",
                  marginBottom: "2rem",
                },
              }}
            />
            <div className="mb-6 ml-24">
              <ReactQueryDevtools buttonPosition="bottom-left" />
            </div>
          </div>
        </div>
      </>
    );
  },
});

const authLayout = new Route({
  getParentRoute: () => appRoute,
  id: "auth-layout",
  component: AuthLayout,
});

const dashboardRoute = new Route({
  getParentRoute: () => authLayout,
  path: "/",
  component: IndexPage,
});

const accessionsRoute = new Route({
  getParentRoute: () => authLayout,
  path: "accessions",
  component: () => {
    return <Outlet />;
  },
});

const accessionWorklistRoute = new Route({
  getParentRoute: () => accessionsRoute,
  path: "/",
  component: AccessionWorklistPage,
});

const accessionRoute = new Route({
  getParentRoute: () => accessionsRoute,
  path: "$accessionId",
  parseParams: (params) => ({
    accessionId: z.string().uuid().parse(params.accessionId),
  }),
  component: EditAccessionPage,
});

const routeTree = appRoute.addChildren([
  authLayout.addChildren([
    dashboardRoute,
    accessionsRoute.addChildren([accessionWorklistRoute, accessionRoute]),
  ]),
]);

// Create the router using your route tree
export const router = new Router({ routeTree });

// Register your router for maximum type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export type AllRoutesPaths = RegisteredRoutesInfo["routePaths"];
