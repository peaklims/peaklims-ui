import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings/organizations")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/settings/organizations/"!</div>;
}
