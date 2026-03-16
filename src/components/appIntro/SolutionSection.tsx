import type React from 'react'
import {
  LuGraduationCap,
  LuUsers,
  LuBuilding2,
  LuClipboard,
  LuChartNoAxesColumn,
  LuAward,
  LuBuilding,
} from 'react-icons/lu'
import GlassContainer from '../liquidGlass/GlassContainer'

const data = [
  {
    icon: <LuBuilding2 size={28} />,
    label: 'Facility',
  },
  {
    icon: <LuUsers size={28} />,
    label: 'Cohort',
  },
  {
    icon: <LuGraduationCap size={28} />,
    label: 'Training',
  },
  {
    icon: <LuClipboard size={28} />,
    label: 'Assessment',
  },
  {
    icon: <LuChartNoAxesColumn size={28} />,
    label: 'Placement',
  },
  {
    icon: <LuBuilding size={28} />,
    label: 'Consultancy',
  },
  {
    icon: <LuAward size={28} />,
    label: 'Alumni',
  },
]
const SolutionSection = () => {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center gap-6">
        <div className="h-px flex-1 bg-white/10" />
        <h3 className="text-[11px] uppercase tracking-[0.6em] text-white/50">
          Solution Overview
        </h3>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className="relative mx-auto w-full max-w-5xl">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-7">
          {data.map((item) => (
            <SolutionCard
              key={item.label}
              icon={item.icon}
              label={item.label}
            />
          ))}
        </div>
      </div>

      <GlassContainer
        className="flex items-center mx-auto max-w-4xl h-24 md:h-12 rounded-2xl border-white/10 px-6 py-4 text-center text-sm text-white/65"
        style={{ background: 'rgba(255,255,255,0.04)' }}
      >
        This platform connects physical training infrastructure, academic
        delivery, and workforce placement into a single role-based system.
      </GlassContainer>
    </div>
  )
}

const SolutionCard = ({
  icon,
  label,
}: {
  icon: React.ReactElement
  label: string
}) => {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="group flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 text-white/90 backdrop-blur-xl transition-transform duration-200 hover:-translate-y-1"
        style={{
          background: 'rgba(255,255,255,0.06)',
          boxShadow:
            '0 10px 26px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.04)',
        }}
      >
        {icon}
      </div>
      <span className="text-xs uppercase tracking-[0.28em] text-white/70 text-nowrap">
        {label}
      </span>
    </div>
  )
}

export default SolutionSection
