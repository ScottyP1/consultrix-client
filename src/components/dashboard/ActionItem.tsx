import ItemContainer from '#/components/ItemContainer'
import type { DashboardActionItemData } from '#/data/dashboard/types'

type ActionItemProps = DashboardActionItemData

const ActionItem = ({
  icon: Icon,
  title,
  subTitle,
  btnLabel,
  iconAccent,
  iconBg,
}: ActionItemProps) => {
  return (
    <ItemContainer className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-4">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: iconBg }}
        >
          <Icon size={20} color={iconAccent} />
        </div>

        <div className="flex min-w-0 flex-col gap-1">
          <h4 className="truncate">{title}</h4>
          <h5 className="text-xs text-white/45">{subTitle}</h5>
        </div>
      </div>

      <button className="shrink-0 rounded-lg px-2 py-1 hover:cursor-pointer">
        {btnLabel}
      </button>
    </ItemContainer>
  )
}

export default ActionItem
