import { createFileRoute, Outlet } from '@tanstack/react-router'

import AuthCTA from '@/components/auth/AuthCTA'

export const Route = createFileRoute('/auth')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex h-screen items-center justify-center text-white">
      <div className="flex h-150 md:w-5xl w-full">
        <AuthCTA />
        <div className="flex w-full md:w-1/2 items-center justify-center">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
