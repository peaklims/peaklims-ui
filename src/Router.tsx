import AuthLayout from "@/layouts/AuthLayout";
import { ReactQueryDevtools, TanStackRouterDevtools } from "@/lib/dev-tools";
import { AccessionWorklistPage } from "@/pages/Accessions";
import { IndexPage } from "@/pages/Index";
import {
  Outlet,
  RegisteredRoutesInfo,
  RootRoute,
  Route,
  Router,
} from "@tanstack/react-router";
import { Helmet } from "react-helmet";
import { z } from "zod";
import { siteConfig } from "./lib/site-config";
import { EditAccessionPage } from "./pages/Accessions/EditAccessionPage";

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

        <div className="h-full min-h-screen font-sans antialiased scroll-smooth debug-screens">
          <Outlet />
          <div className="hidden lg:block">
            <TanStackRouterDevtools
              position="top-right"
              toggleButtonProps={{
                style: {
                  marginRight: "5rem",
                  marginTop: "1.25rem",
                },
              }}
            />
            <ReactQueryDevtools position="top-right" />
          </div>
          <div className="block lg:hidden">
            <TanStackRouterDevtools
              position="bottom-left"
              toggleButtonProps={{
                style: {
                  // marginLeft: "5rem",
                  marginBottom: "2rem",
                },
              }}
            />
            <ReactQueryDevtools
              position="bottom-left"
              toggleButtonProps={{
                style: {
                  marginLeft: "6rem",
                  marginBottom: "1.5rem",
                },
              }}
            />
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
