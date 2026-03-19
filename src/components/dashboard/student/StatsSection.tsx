import StatCard from '../../StatCard'
import { cn } from '#/lib/utils'
import { LuAward, LuClock3, LuClipboardCheck, LuUser } from 'react-icons/lu'

const stats = [
  {
    icon: LuAward,
    iconBgClassName: 'bg-sky-500',
    label: 'Current Grade',
    value: '97.5',
  },
  {
    icon: LuUser,
    iconBgClassName: 'bg-violet-500',
    label: 'Attendance',
    value: '99%',
  },
  {
    icon: LuClipboardCheck,
    iconBgClassName: 'bg-cyan-500',
    label: 'Tickets',
    value: '2',
  },
  {
    icon: LuClock3,
    iconBgClassName: 'bg-red-500',
    label: 'Past Due',
    value: '2',
  },
] as const

const StatsSection = ({ className = '' }: { className?: string }) => {
  return (
    <section
      className={cn('grid gap-4 sm:grid-cols-2 xl:grid-cols-4', className)}
    >
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          icon={stat.icon}
          iconBgClassName={stat.iconBgClassName}
          label={stat.label}
          value={stat.value}
        />
      ))}
    </section>
  )
}

export default StatsSection
