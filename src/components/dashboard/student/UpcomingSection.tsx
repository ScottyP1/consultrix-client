import GlassContainer from '#/components/liquidGlass/GlassContainer'
import { LuBook } from 'react-icons/lu'

const upcomingItems = [
  {
    assignment: 'Node.js Final Project',
    module: '308',
    date: 'Feb 23, 2026',
  },
  {
    assignment: 'Node.js Final Project',
    module: '308',
    date: 'Feb 23, 2026',
  },
  {
    assignment: 'Node.js Final Project',
    module: '308',
    date: 'Feb 23, 2026',
  },
]

const UpcomingSection = () => {
  return (
    <div className="flex flex-col gap-3">
      {upcomingItems.map((item) => (
        <div className="flex items-center justify-between rounded-[14px] px-4 py-3 shadow-[0px_10px_30px_-18px_rgba(0,0,0,0.45),0px_1px_0px_rgba(255,255,255,0.08)_inset,0px_0px_0px_1px_rgba(255,255,255,0.02)_inset] backdrop-blur-[10px]">
          <div className="space-y-1">
            <h3 className="text-base font-medium text-white">
              {item.assignment}
            </h3>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <span className="text-xs text-white/45">{item.date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/50">
              <LuBook size={16} />
              <span className="text-xs text-white/45">
                Module {item.module}
              </span>
            </div>
          </div>
          <span className="rounded-full border border-white/10 bg-white/8 px-2.5 py-1 text-xs uppercase tracking-[0.18em] text-white/55">
            Upcoming
          </span>
        </div>
      ))}
    </div>
  )
}

export default UpcomingSection
