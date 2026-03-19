import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Outlet, useNavigate } from '@tanstack/react-router'

import { useAuth } from '@/context/AuthContext'
import { instructorNavLinks } from '@/components/navigation/sidebar-config'
import { requireAuth } from '@/lib/require-auth'
import SideBar from '#/components/navigation/SideBar'

export const Route = createFileRoute('/instructor')({
  beforeLoad: () => requireAuth(),
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      void navigate({ to: '/auth/login', replace: true })
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) {
    return null
  }

  return (
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
  )
}
