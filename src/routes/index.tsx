import { createFileRoute } from "@tanstack/react-router";

import { Helmet, HelmetProvider } from "react-helmet-async";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="">
      <HelmetProvider>
        <Helmet>
          <title>Dashboard</title>
        </Helmet>
      </HelmetProvider>

      <div className="space-y-3">Dashboard</div>
    </div>
  );
}
