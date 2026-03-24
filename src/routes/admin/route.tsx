import { useEffect } from 'react'
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'

import { useAuth } from '@/context/AuthContext'
import { adminNavLinks } from '@/components/navigation/sidebar-config'
import { requireAuth } from '@/lib/require-auth'
import { getDefaultRouteForRole, ROLE_ADMIN } from '@/lib/auth-role'
import SideBar from '#/components/navigation/SideBar'

export const Route = createFileRoute('/admin')({
  beforeLoad: () => requireAuth([ROLE_ADMIN]),
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

    if (role && role !== ROLE_ADMIN) {
      void navigate({ to: getDefaultRouteForRole(role), replace: true })
    }
  }, [isAuthenticated, navigate, role])

  if (!isAuthenticated || (role && role !== ROLE_ADMIN)) {
    return null
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">
      <SideBar
        links={adminNavLinks}
        name="admin"
        roleLabel="admin"
        avatarLabel="A"
      />
      <main className="relative min-h-screen px-4 pt-6 pb-28 md:px-6 md:pt-6 md:pb-6 md:pl-[19rem]">
        <div className="mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
