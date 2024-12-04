import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings/panels')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/settings/panels"!</div>
}
