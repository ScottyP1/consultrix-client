import {
  LuTarget,
  LuMessageSquare,
  LuGraduationCap,
  LuClipboardPen,
} from 'react-icons/lu'
import Header from './Header'
import GlassContainer from '../liquidGlass/GlassContainer'

const data = [
  {
    icon: <LuTarget size={32} color="#E6EDF6" />,
    title: 'Recruiting',
    subTitle: 'Candidate pipeline tracking',
    phase: 'Phase 01',
  },
  {
    icon: <LuMessageSquare size={32} color="#E6EDF6" />,
    title: 'Interviewing',
    subTitle: 'Selection and enrollment status',
    phase: 'Phase 02',
  },
  {
    icon: <LuGraduationCap size={32} color="#E6EDF6" />,
    title: 'Active Training',
    subTitle: 'Academic progress monitoring',
    phase: 'Phase 03',
  },
  {
    icon: <LuClipboardPen size={32} color="#E6EDF6" />,
    title: 'Assessment',
    subTitle: 'Performance metrics evaluation',
    phase: 'Phase 04',
  },
]

const CohortLifecycleTimeline = () => {
  return (
    <div className="relative flex flex-col gap-16">
      <div className="pointer-events-none absolute inset-0 -z-10" />
      <Header
        title="Cohort Lifecycle Timeline"
        subTitle="from recruitment to alumni tracking"
      />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {data.map((item) => (
          <CohortCard
            key={item.title}
            icon={item.icon}
            title={item.title}
            subTitle={item.subTitle}
            phase={item.phase}
          />
        ))}
      </div>
    </div>
  )
}

export default CohortLifecycleTimeline

const CohortCard = ({
  icon,
  title,
  subTitle,
  phase,
}: {
  icon: React.ReactElement
  title: string
  subTitle: string
  phase: string
}) => {
  return (
    <GlassContainer
      className="relative flex h-full min-h-[220px] flex-col gap-6 rounded-3xl border-white/10 p-6"
      style={{ background: 'rgba(255,255,255,0.04)' }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.35em] text-white/40">
          {phase}
        </span>
      </div>
      <div
        className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10"
        style={{
          background: 'rgba(255,255,255,0.06)',
          boxShadow: `0 12px 28px rgba(0,0,0,0.35)`,
        }}
      >
        {icon}
      </div>
      <div>
        <h3 className="text-base font-semibold tracking-wide text-white/90">
          {title}
        </h3>
        <p className="mt-2 text-sm text-white/60">{subTitle}</p>
      </div>
    </GlassContainer>
  )
}
