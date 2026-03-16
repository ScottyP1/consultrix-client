import GlassContainer from '../liquidGlass/GlassContainer'

import {
  LuGraduationCap,
  LuUsers,
  LuLayoutDashboard,
  LuBuilding,
  LuChartLine,
  LuCircleCheckBig,
} from 'react-icons/lu'
import Header from './Header'

const data = [
  {
    icon: <LuUsers size={34} />,
    title: 'Student',
    issues: [
      'View modules and assignments',
      'Submit work',
      'Track grades and feedback',
      'Access calender and announcements',
    ],
  },
  {
    icon: <LuGraduationCap size={34} />,
    title: 'Instructor',
    issues: [
      'Manage coursework',
      'Review submissions',
      'Assign grades',
      'Monitor attendance and engagement',
      'Flag at-risk students',
    ],
  },
  {
    icon: <LuBuilding size={34} />,
    title: 'Warehouse Operations',
    issues: [
      'Manage facilities',
      'Track equipment and capacity',
      'Assign instructors and cohorts',
      'Monitor utilization',
    ],
  },
  {
    icon: <LuLayoutDashboard size={34} />,
    title: 'Program Administrator',
    issues: [
      'Create and manage cohorts',
      'Assign students and instructors',
      'Track program status',
      'Manage pipeline stages',
    ],
  },
  {
    icon: <LuChartLine size={34} />,
    title: 'Executive Leadership',
    issues: [
      'Create and manage cohorts',
      'Assign students and instructors',
      'Track program status',
      'Manage pipeline stages',
    ],
  },
]

const CapabilitiesSection = () => {
  return (
    <div>
      <div className="flex flex-col gap-24">
        <Header
          title="Tailored capabilites for each stakeholder"
          subTitle="CORE CAPABILITIES"
        />
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-5">
          {data.map((item) => (
            <CapabilityCard
              key={item.title}
              icon={item.icon}
              title={item.title}
              issues={item.issues}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
export default CapabilitiesSection

const CapabilityCard = ({
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
      className="relative flex h-full min-h-[20rem] flex-col gap-6 rounded-3xl border-white/10 p-6"
      style={{ background: 'rgba(255,255,255,0.04)' }}
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="flex h-15 w-15 items-center justify-center rounded-2xl border border-white/10 text-white/90"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          {icon}
        </div>
        <div className="text-xs text-center font-semibold uppercase tracking-[0.28em] text-white/80">
          {title}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 text-sm text-white/70">
        {issues.map((item) => (
          <div key={item} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-4 w-4 items-center justify-center text-[#6ddf8a]">
              <LuCircleCheckBig size={16} />
            </span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </GlassContainer>
  )
}
