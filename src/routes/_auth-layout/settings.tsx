import { cn } from '@/lib/utils'
import {
  Link,
  Outlet,
  createFileRoute,
  linkOptions,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet'

export const Route = createFileRoute('/_auth-layout/settings')({
  component: RouteComponent,
  // this should work but just freezes the browser
  // loader: () => {
  //   throw redirect({ to: "/settings/organizations", replace: true });
  // },
})

const options = [
  linkOptions({
    to: '/settings/organizations',
    label: 'Organizations',
    helmet: 'Organization Settings',
    false: true,
    // activeOptions: { exact: true },
  }),
  linkOptions({
    to: '/settings/panels',
    label: 'Panels',
    helmet: 'Panel Settings',
    disabled: true,
  }),
]

function RouteComponent() {
  const routerState = useRouterState()
  const currentLinkOptionWithContains = options.find((option) =>
    routerState.location.pathname.includes(option.to),
  )

  const helmetTitle =
    currentLinkOptionWithContains !== null &&
    currentLinkOptionWithContains !== undefined
      ? `${currentLinkOptionWithContains.helmet}`
      : 'Settings'

  return (
    <>
      <Helmet>
        <title>{helmetTitle}</title>
      </Helmet>

      <h1 className="text-4xl font-bold tracking-tight scroll-m-20">
        Settings
      </h1>

      <div className="pt-4">
        <AnimatedTabLinks tabs={options} />
      </div>
      <div className="pt-2" />
      <Outlet />
    </>
  )
}

// temporary until i can get the router to do this
function useRedirectToOrganizationsTab() {
  const routerState = useRouterState()
  const navigate = useNavigate()

  useEffect(() => {
    if (routerState.location.pathname === '/settings') {
      navigate({ to: '/settings/organizations' })
    }
  }, [navigate, routerState.location.pathname])
}

function AnimatedTabLinks({
  tabs,
}: {
  tabs: { to: string; label: string; disabled: boolean }[]
}) {
  const routerState = useRouterState()
  useRedirectToOrganizationsTab()

  return (
    <>
      <div className="flex space-x-1">
        {tabs.map((option) => (
          <Link
            key={option.to}
            disabled={option.disabled}
            to={option.to}
            className={cn(
              'relative px-3 py-1.5 text-sm font-medium text-white transition focus-visible:outline-2 select-none',
              routerState.location.pathname === option.to
                ? 'text-emerald-500'
                : 'text-slate-700 hover:text-slate-500',
              option.disabled && 'text-slate-300 hover:text-slate-300',
            )}
          >
            <span>{option.label}</span>
            {routerState.location.pathname === option.to && (
              <motion.div
                layoutId="active-underline"
                className="absolute left-0 right-0 bottom-0 h-0.5 bg-emerald-500"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
          </Link>
        ))}
      </div>

      <div className="-mt-px border-b border-slate-200" />
    </>
  )
}
