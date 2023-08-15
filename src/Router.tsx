import AuthLayout from "@/layouts/AuthLayout";
import { TanStackRouterDevtools } from "@/lib/DevTools";
import { IndexPage, OrdersPage } from "@/pages/Index";
import {
  Outlet,
  RegisteredRoutesInfo,
  RootRoute,
  Route,
  Router,
} from "@tanstack/react-router";

const appRoute = new RootRoute({
  component: () => {
    return (
      <>
        {/* <Helmet
          titleTemplate={`%s | ${siteConfig.name}`}
          defaultTitle={siteConfig.name}>

          <meta name="description" content={siteConfig.description} />
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
          <meta property="twitter:image" content={siteConfig.ogImage} />
        </Helmet> */}

        <div className="h-full min-h-screen font-sans antialiased scroll-smooth debug-screens">
          <Outlet />
          <TanStackRouterDevtools position="top-right" />
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

const indexRoute = new Route({
  getParentRoute: () => authLayout,
  path: "/",
  component: IndexPage,
});

const orderRoute = new Route({
  getParentRoute: () => authLayout,
  path: "/orders",
  component: OrdersPage,
});

const routeTree = appRoute.addChildren([
  authLayout.addChildren([indexRoute, orderRoute]),
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
