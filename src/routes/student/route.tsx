import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Outlet, useNavigate } from '@tanstack/react-router'

import { useAuth } from '@/context/AuthContext'
import { studentNavLinks } from '@/components/navigation/sidebar-config'
import { requireAuth } from '@/lib/require-auth'
import { getDefaultRouteForRole, ROLE_STUDENT } from '@/lib/auth-role'
import SideBar from '#/components/navigation/SideBar'

import Grainient from '#/components/Grainient'
import MagicRings from '#/components/MagicRings'

export const Route = createFileRoute('/student')({
  beforeLoad: () => requireAuth([ROLE_STUDENT]),
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

    if (role && role !== ROLE_STUDENT) {
      void navigate({ to: getDefaultRouteForRole(role), replace: true })
    }
  }, [isAuthenticated, navigate, role])

  if (!isAuthenticated || (role && role !== ROLE_STUDENT)) {
    return null
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        {/* <Grainient
          color1="#4f6e96"
          color2="#000000"
          color3="#91c0fd"
          timeSpeed={0.58}
          colorBalance={-0.08}
          warpStrength={1.6}
          warpFrequency={4}
          warpSpeed={1.8}
          warpAmplitude={34}
          blendAngle={15}
          blendSoftness={0.12}
          rotationAmount={180}
          noiseScale={1.8}
          grainAmount={0.08}
          grainScale={2}
          grainAnimated={false}
          contrast={1.3}
          gamma={1}
          saturation={1.1}
          centerX={0}
          centerY={0}
          zoom={1}
        /> */}
        {/* <MagicRings
          color="#fc42ff"
          colorTwo="#42fcff"
          ringCount={6}
          speed={0.4}
          attenuation={10}
          lineThickness={2}
          baseRadius={0.35}
          radiusStep={0.1}
          scaleRate={0.1}
          opacity={1}
          blur={0}
          noiseAmount={0.1}
          rotation={0}
          ringGap={1.5}
          fadeIn={0.7}
          fadeOut={0.5}
          followMouse={false}
          mouseInfluence={0.2}
          hoverScale={1.2}
          parallax={0.05}
          clickBurst={false}
        /> */}
      </div>
      <SideBar
        links={studentNavLinks}
        name="username"
        roleLabel="student"
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
