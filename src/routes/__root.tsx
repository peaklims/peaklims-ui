import { Notification } from "@/components/notifications";
import { ReactQueryDevtools } from "@/lib/dev-tools";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import {
  Outlet,
  ScrollRestoration,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ClickToComponent } from "click-to-react-component";
import { Helmet, HelmetProvider } from "react-helmet-async";

export const Route = createRootRoute({
  component: RootComponent,
});

const runInDemoMode = false;

function RootComponent() {
  return (
    <>
      <HelmetProvider>
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
      </HelmetProvider>

      <div
        className={cn(
          "min-h-svh font-sans antialiased scroll-smooth [font-feature-settings:'ss01']",
          !runInDemoMode && "debug-screens"
        )}
      >
        <ScrollRestoration />
        <Outlet />
        <Notification />
        <ClickToComponent />
        {!runInDemoMode && (
          <>
            <div className="hidden md:block">
              <TanStackRouterDevtools
                position="bottom-right"
                toggleButtonProps={{
                  style: {
                    marginRight: "5rem",
                    marginBottom: ".75rem",
                  },
                }}
              />
              <ReactQueryDevtools buttonPosition="bottom-right" />
            </div>
            <div className="block md:hidden">
              <TanStackRouterDevtools
                position="bottom-left"
                toggleButtonProps={{
                  style: {
                    marginLeft: "5rem",
                    marginBottom: ".75rem",
                  },
                }}
              />
              <div className="mb-6 ml-24">
                <ReactQueryDevtools buttonPosition="bottom-left" />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
