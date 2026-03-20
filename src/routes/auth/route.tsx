import { useEffect } from 'react'
import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from '@tanstack/react-router'

import AuthCTA from '@/components/auth/AuthCTA'
import { useAuth } from '@/context/AuthContext'
import { getAuthSession } from '@/lib/auth-token'
import { getDefaultRouteForRole } from '@/lib/auth-role'
import Grainient from '#/components/Grainient'

export const Route = createFileRoute('/auth')({
  beforeLoad: () => {
    if (typeof window !== 'undefined') {
      const session = getAuthSession()

      if (session?.token) {
        throw redirect({ to: getDefaultRouteForRole(session.role) })
      }
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { isAuthenticated, role } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      void navigate({ to: getDefaultRouteForRole(role), replace: true })
    }
  }, [isAuthenticated, navigate, role])

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen items-center justify-center text-white">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <Grainient
          color1="#4f6e96"
          color2="#000000"
          color3="#91c0fd"
          timeSpeed={0.35}
          colorBalance={-0.01}
          warpStrength={2.15}
          warpFrequency={5}
          warpSpeed={2}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>
      <div className="flex h-150 md:w-5xl w-full">
        <AuthCTA />
        <div className="flex w-full md:w-1/2 items-center justify-center">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
