import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Outlet, useNavigate } from '@tanstack/react-router'

import { useAuth } from '@/context/AuthContext'
import { instructorNavLinks } from '@/components/navigation/sidebar-config'
import { requireAuth } from '@/lib/require-auth'
import { getDefaultRouteForRole, ROLE_INSTRUCTOR } from '@/lib/auth-role'
import SideBar from '#/components/navigation/SideBar'
import { StompClientProvider } from '@/providers/StompClientProvider'

export const Route = createFileRoute('/instructor')({
  beforeLoad: () => requireAuth([ROLE_INSTRUCTOR]),
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { isAuthenticated, role } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      void navigate({ to: '/auth/login', replace: true })
      return
    }

    if (role && role !== ROLE_INSTRUCTOR) {
      void navigate({ to: getDefaultRouteForRole(role), replace: true })
    }
  }, [isAuthenticated, navigate, role])

  if (!isAuthenticated || (role && role !== ROLE_INSTRUCTOR)) {
    return null
  }

  return (
    <StompClientProvider>
      <div className="relative min-h-screen overflow-x-hidden text-white">
        <SideBar
          links={instructorNavLinks}
          name="username"
          roleLabel="instructor"
          avatarLabel="A"
        />
        <main className="relative min-h-screen px-4 pt-6 pb-28 md:px-6 md:pt-6 md:pb-6 md:pl-[19rem]">
          <div className="mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </StompClientProvider>
  )
}
