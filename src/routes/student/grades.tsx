import StatCard from '#/components/dashboard/StatCard'
import GradesModulesList from '#/components/grades/student/GradesModulesList'
import { createFileRoute } from '@tanstack/react-router'

import { LuAward, LuChartBarIncreasing, LuBookOpenCheck } from 'react-icons/lu'

export const Route = createFileRoute('/student/grades')({
  component: RouteComponent,
})

const gradeStatData = [
  {
    icon: LuAward,
    iconBgClassName: 'bg-sky-500',
    label: 'Current Grade',
    value: '98.2',
  },
  {
    icon: LuChartBarIncreasing,
    iconBgClassName: 'bg-violet-500',
    label: 'Current Term Average',
    value: '89.5%',
  },
  {
    icon: LuBookOpenCheck,
    iconBgClassName: 'bg-sky-500',
    label: 'Assignments Graded',
    value: '12/15',
  },
]

function RouteComponent() {
  return (
    <div className="flex flex-col gap-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Grades
        </h1>
        <p className="text-sm text-white/55">
          Review your academic performance
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {gradeStatData.map((item) => (
          <StatCard
            key={item.label}
            icon={item.icon}
            iconBgClassName={item.iconBgClassName}
            label={item.label}
            value={item.value}
          />
        ))}
      </div>

      <GradesModulesList />
    </div>
  )
}
