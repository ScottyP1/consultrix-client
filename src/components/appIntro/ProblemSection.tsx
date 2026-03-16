import {
  LuGraduationCap,
  LuUsers,
  LuLayoutDashboard,
  LuBadgeInfo,
} from 'react-icons/lu'
import GlassContainer from '../liquidGlass/GlassContainer'
import Header from './Header'

const data = [
  {
    icon: <LuUsers size={34} />,
    title: 'Students',
    issues: [
      'Scattered assignments across tools',
      'Poor visibility into grades and progress',
      'No centralized calendar',
      'Limited communication clarity',
    ],
  },
  {
    icon: <LuGraduationCap size={34} />,
    title: 'Instructors',
    issues: [
      'Disorganized submissions',
      'Manual grading workflows',
      'No oriented student performance tracking',
      'Difficulty identifying at-risk students',
    ],
  },
  {
    icon: <LuLayoutDashboard size={34} />,
    title: 'Program & Operation Leaders',
    issues: [
      'No real-time cohort visibility',
      'No facility capacity tracking',
      'Limited placement pipeline insight',
      'Fragmented data across organizations',
    ],
  },
]
const ProblemSection = () => {
  return (
    <div className="flex flex-col gap-24">
      <Header title="Where the System Breaks" subTitle="Problem Statement" />
      <div className="grid gap-6 md:grid-cols-3">
        {data.map((item) => (
          <ProblemCard
            key={item.title}
            icon={item.icon}
            title={item.title}
            issues={item.issues}
          />
        ))}
      </div>
    </div>
  )
}

export default ProblemSection

const ProblemCard = ({
  icon,
  title,
  issues,
}: {
  icon: React.ReactElement
  title: string
  issues: Array<string>
}) => {
  return (
    <GlassContainer
      className="relative flex h-full flex-col gap-6 rounded-3xl border-white/10 p-6"
      style={{ background: 'rgba(255,255,255,0.04)' }}
    >
      <div className="flex items-center gap-4">
        <div
          className="flex min-h-14 min-w-14 items-center justify-center rounded-2xl border border-white/10 text-white/90"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          {icon}
        </div>
        <span className="text-sm font-semibold uppercase tracking-[0.28em] text-white/80">
          {title}
        </span>
      </div>
      <div className="flex flex-col gap-3 text-sm text-white/70">
        {issues.map((item) => (
          <div key={item} className="flex items-center gap-3">
            <LuBadgeInfo color="red" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </GlassContainer>
  )
}
