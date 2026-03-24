import { Link } from '@tanstack/react-router'
import ItemContainer from '#/components/ItemContainer'
import type { DashboardActionItemData } from '#/data/dashboard/types'

type ActionItemProps = DashboardActionItemData

const ActionItem = ({
  assignmentId,
  to,
  icon: Icon,
  title,
  subTitle,
  btnLabel,
  iconAccent,
  iconBg,
  isLate,
}: ActionItemProps) => {
  const linkTo = to ?? (assignmentId != null ? `/student/assignment/${assignmentId}` : null)

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
          <div className="flex items-center gap-2">
            <h4 className="truncate">{title}</h4>
            {isLate && (
              <span className="shrink-0 rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-400">
                Late
              </span>
            )}
          </div>
          <h5 className="text-xs text-white/45">{subTitle}</h5>
        </div>
      </div>

      {linkTo != null ? (
        <Link
          to={linkTo as never}
          className="shrink-0 rounded-lg bg-white/8 px-3 py-1.5 text-sm text-white/70 transition-colors hover:bg-white/15 hover:text-white"
        >
          {btnLabel}
        </Link>
      ) : (
        <button className="shrink-0 rounded-lg bg-white/8 px-3 py-1.5 text-sm text-white/70 transition-colors hover:bg-white/15 hover:text-white">
          {btnLabel}
        </button>
      )}
    </ItemContainer>
  )
}

export default ActionItem
