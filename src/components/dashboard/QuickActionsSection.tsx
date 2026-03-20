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

        return (
          <div
            key={item.title}
            className="flex items-center gap-2 rounded-lg p-4"
            style={{ backgroundColor: item.bgColor }}
          >
            <Icon color={item.iconAccent} />
            <h4 style={{ color: item.iconAccent }}>{item.title}</h4>
          </div>
        )
      })}
    </div>
  )
}

export default QuickActionsSection
