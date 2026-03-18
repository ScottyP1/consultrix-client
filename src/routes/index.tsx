import { useEffect } from 'react'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'

import { getToken } from '@/lib/auth-token'
import { useAuth } from '@/context/AuthContext'

import HeroSection from '#/components/appIntro/HeroSection'
import PartnersLoop from '#/components/UI/PartnersLoop'
import SolutionSection from '#/components/appIntro/SolutionSection'
import ProblemSection from '#/components/appIntro/ProblemSection'
import CapabilitiesSection from '#/components/appIntro/CapabilitiesSection'
import WarehouseManagementSection from '#/components/appIntro/WarehouseManagementSection'
import CohortLifecycleTimeline from '#/components/appIntro/CohortTimeline'
import Grainient from '#/components/Grainient'
import BenefitsSection from '#/components/appIntro/BenefitsSection'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    if (typeof window !== 'undefined' && getToken()) {
      throw redirect({ to: '/student/dashboard' })
    }
  },
  component: App,
})

function App() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      void navigate({ to: '/student/dashboard', replace: true })
    }
  }, [isAuthenticated, navigate])

  if (isAuthenticated) {
    return null
  }

  return (
    <main className="relative min-h-screen w-full px-4 text-[#D9DEE5] overflow-x-hidden">
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
      <section
        id="hero"
        className="relative mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col gap-16 box-border pt-28 pb-16 scroll-mt-24"
      >
        {/* <GlowOrb /> */}
        <HeroSection />
        <PartnersLoop />
      </section>

      <section
        id="solutions"
        className="relative mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col gap-16 box-border pt-20 pb-16 scroll-mt-24"
      >
        <ProblemSection />
        <SolutionSection />
      </section>

      <section
        id="capabilities"
        className="relative mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col gap-16 box-border pt-28 pb-16 scroll-mt-24"
      >
        <CapabilitiesSection />
      </section>
      <section
        id="warehouse-ops"
        className="relative mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col gap-16 box-border pt-28 pb-16 scroll-mt-24"
      >
        <WarehouseManagementSection />
      </section>
      <section
        id="cohort-timeline"
        className="relative mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col gap-16 box-border pt-28 pb-16 scroll-mt-24"
      >
        <CohortLifecycleTimeline />
      </section>
      <section
        id="key-benefits"
        className="relative mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col gap-16 box-border pt-28 pb-28 scroll-mt-24"
      >
        <BenefitsSection />
      </section>
    </main>
  )
}
