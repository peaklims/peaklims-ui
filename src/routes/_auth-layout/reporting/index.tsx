import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth-layout/reporting/')({
  component: RouteComponent,
})

function RouteComponent() {
  return 'Hello /reporting/!'
}
