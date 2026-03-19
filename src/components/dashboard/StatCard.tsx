import GlassContainer from '../liquidGlass/GlassContainer'
import { LuAward, LuClock } from 'react-icons/lu'

const variantStructure = {
  Award: {
    bg: 'bg-purple-500',
    icon: LuAward,
    title: 'Current GPA',
    value: '3.85',
    detail: '+ 0.15 from last term',
  },
  Clock: {
    bg: 'bg-yellow-500',
    icon: LuClock,
    title: 'Hours tracked',
    value: '86.5',
    detail: '6.5 hours added in the last 7 days',
  },
}

const StatCard = ({
  variant,
  className,
}: {
  variant: keyof typeof variantStructure
  className?: string
}) => {
  const config = variantStructure[variant]
  const Icon = config.icon

  return (
    <GlassContainer className={`p-4 ${className}`}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="relative flex h-12 w-12 items-center justify-center">
            <div className={`absolute inset-0 z-0 rounded-xl ${config.bg}`} />
            <Icon className="relative z-10 text-white" size={30} />
          </div>
          <h3 className="text-3xl font-semibold tracking-tight text-white">
            {config.value}
          </h3>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-white/60">{config.title}</p>

          <p className="text-sm text-white/50">{config.detail}</p>
        </div>
      </div>
    </GlassContainer>
  )
}

export default StatCard
