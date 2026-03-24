import { Link } from '@tanstack/react-router'
import type { DashboardQuickActionItem } from '#/data/dashboard/types'

const QuickActionsSection = ({
  items,
}: {
  items: DashboardQuickActionItem[]
}) => {
  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => {
        const Icon = item.icon
        const inner = (
          <div
            className="flex items-center gap-2 rounded-lg p-4 transition-opacity hover:opacity-80"
            style={{ backgroundColor: item.bgColor }}
          >
            <Icon color={item.iconAccent} />
            <h4 style={{ color: item.iconAccent }}>{item.title}</h4>
          </div>
        )

        if (item.to) {
          return (
            <Link key={item.title} to={item.to as never}>
              {inner}
            </Link>
          )
        }

        return <div key={item.title}>{inner}</div>
      })}
    </div>
  )
}

export default QuickActionsSection
