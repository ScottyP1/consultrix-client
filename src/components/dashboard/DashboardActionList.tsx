import type { DashboardActionItemData } from '#/data/dashboard/types'

import ActionItem from './ActionItem'

const DashboardActionList = ({
  className = '',
  items,
}: {
  className?: string
  items: DashboardActionItemData[]
}) => {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {items.map((item, index) => (
        <ActionItem
          key={`${item.title}-${index}`}
          icon={item.icon}
          iconAccent={item.iconAccent}
          iconBg={item.iconBg}
          title={item.title}
          subTitle={item.subTitle}
          btnLabel={item.btnLabel}
        />
      ))}
    </div>
  )
}

export default DashboardActionList
