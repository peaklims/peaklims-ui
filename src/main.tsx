import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { HotkeysProvider } from "react-hotkeys-hook";
import { FullScreenLoading } from "./components/full-screen-loading";
import "./index.css";
import { routeTree } from "./routeTree.gen";
import { useAuthUser } from "./services/auth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: 0,
    },
  },
});
// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <Suspense fallback={null}> */}
    <QueryClientProvider client={queryClient}>
      <NextUIProvider>
        <HotkeysProvider>
          <App />
        </HotkeysProvider>
      </NextUIProvider>
    </QueryClientProvider>
    {/* </Suspense> */}
  </StrictMode>
);

function App() {
  const { isLoading } = useAuthUser();
  if (isLoading) return <FullScreenLoading />;

  return <RouterProvider router={router} />;
}
