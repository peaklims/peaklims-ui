import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/runs/')({
  component: RouteComponent,
})

function RouteComponent() {
  return 'Hello /runs/!'
}
