import StatCard from '../StatCard'
import { cn } from '#/lib/utils'
import type { StatsSectionItem } from '#/data/dashboard/types'

const StatsSection = ({
  className = '',
  stats,
}: {
  className?: string
  stats: StatsSectionItem[]
}) => {
  return (
    <section
      className={cn('grid gap-4 sm:grid-cols-2 xl:grid-cols-4', className)}
    >
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          icon={stat.icon}
          iconBgClassName={stat.iconBgClassName}
          iconAccent={stat.iconAccent}
          label={stat.label}
          value={stat.value}
        />
      ))}
    </section>
  )
}

export default StatsSection
