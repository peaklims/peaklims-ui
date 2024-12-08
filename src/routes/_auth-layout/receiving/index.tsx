import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth-layout/receiving/')({
  component: RouteComponent,
})

function RouteComponent() {
  return 'Hello receiving!'
}
