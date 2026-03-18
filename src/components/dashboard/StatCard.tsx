import type { IconType } from 'react-icons'

import GlassContainer from '../liquidGlass/GlassContainer'

type StatCardProps = {
  icon: IconType
  iconBgClassName: string
  label: string
  value: string
  className?: string
}

const StatCard = ({
  icon: Icon,
  iconBgClassName,
  label,
  value,
  className = '',
}: StatCardProps) => {
  return (
    <GlassContainer className={`p-4 ${className}`}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex h-12 w-12 items-center justify-center">
            <div className={`absolute inset-0 rounded-xl ${iconBgClassName}`} />
            <Icon className="relative z-10 text-white" size={30} />
          </div>

          <h3 className="text-xl font-semibold tracking-tight text-white">
            {value}
          </h3>
        </div>

        <p className="text-sm text-white/60">{label}</p>
      </div>
    </GlassContainer>
  )
}

export default StatCard
