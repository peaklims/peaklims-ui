import { TanStackRouterDevtools } from "@/lib/DevTools";
import { IndexPage, OrdersPage } from "@/pages/Index";
import {
  Outlet,
  RegisteredRoutesInfo,
  RootRoute,
  Route,
  Router,
} from "@tanstack/react-router";

const rootRoute = new RootRoute({
  component: Root,
});

function Root() {
  return (
    <div className="h-full min-h-screen font-sans antialiased scroll-smooth debug-screens">
      <Outlet />
      <TanStackRouterDevtools position="top-right" />
    </div>
  );
}

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: IndexPage,
});

const orderRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/orders",
  component: OrdersPage,
});

// Create the route tree using your routes
const routeTree = rootRoute.addChildren([indexRoute, orderRoute]);

// Create the router using your route tree
export const router = new Router({ routeTree });

// Register your router for maximum type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export type AllRoutesPaths = RegisteredRoutesInfo["routePaths"];
