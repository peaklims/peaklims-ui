import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/receiving/")({
  component: RouteComponent,
});

function RouteComponent() {
  return "Hello receiving!";
}
