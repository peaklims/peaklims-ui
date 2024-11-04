import { createFileRoute } from '@tanstack/react-router'

import { Helmet } from 'react-helmet'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <div className="">
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <div className="space-y-3">Dashboard</div>
    </div>
  )
}
