import type React from 'react'

import GlassContainer from '../liquidGlass/GlassContainer'
import {
  LuGraduationCap,
  LuFileText,
  LuChartNoAxesColumnIncreasing,
  LuCalendar,
  LuChartNoAxesCombined,
} from 'react-icons/lu'
import Header from './Header'

const data = [
  {
    icon: <LuGraduationCap size={28} />,
    title: 'Instructor Assignments',
    subTitle: 'Staff Allocation',
  },
  {
    icon: <LuFileText size={28} />,
    title: 'Lease Information',
    subTitle: 'Contract details',
  },
  {
    icon: <LuChartNoAxesColumnIncreasing size={28} />,
    title: 'Utilization',
    subTitle: 'Efficiency metrics',
  },
  {
    icon: <LuCalendar size={28} />,
    title: 'Future Availability',
    subTitle: 'Capacity planning',
  },
  {
    icon: <LuChartNoAxesCombined size={28} />,
    span: 'full',
    title: 'Support Expansion Planning',
    subTitle: `Real-time warehouse data enables leadership to make informed decisions about opening new training facilities, 
      optimizing current capacity and forecasting infrastructure needs based on enrollment trends and placement demand.`,
  },
]

const WarehouseManagementSection = () => {
  return (
    <div className="flex flex-col gap-24">
      <Header
        title="Warehouse Operations Management"
        subTitle="PHYSICAL INFRASTRUCTURE TRACKING AND PLANNING"
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {data.map((item) => (
          <WareHouseCard
            key={item.title}
            icon={item.icon}
            title={item.title}
            subTitle={item.subTitle}
            span={item.span && item.span}
          />
        ))}
      </div>
    </div>
  )
}

export default WarehouseManagementSection

const WareHouseCard = ({
  icon,
  title,
  subTitle,
  span,
}: {
  icon: React.ReactElement
  title: string
  subTitle: string
  span?: string
}) => {
  return (
    <GlassContainer
      className={`relative flex h-full min-h-[220px] flex-col gap-4 rounded-3xl border-white/10 p-6 ${
        span
          ? 'col-span-full items-start text-left'
          : 'items-center text-center'
      }`}
      style={{ background: 'rgba(255,255,255,0.04)' }}
    >
      <div
        className={`flex items-center justify-center rounded-2xl border border-white/10 text-white/80 ${
          span ? 'mb-2 h-14 w-14' : 'mb-1 h-14 w-14'
        }`}
        style={{
          background: 'rgba(255,255,255,0.06)',
        }}
      >
        {icon}
      </div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.28em] text-white/80">
        {title}
      </h3>
      {span ? (
        <p className="text-sm text-white/60">{subTitle}</p>
      ) : (
        <span className="text-[11px] uppercase tracking-[0.2em] text-white/50">
          {subTitle}
        </span>
      )}
    </GlassContainer>
  )
}
