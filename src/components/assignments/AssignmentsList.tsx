import type { IconType } from 'react-icons'
import { LuCircleCheck, LuFile } from 'react-icons/lu'
import type { StudentAssignmentItem, StudentAssignmentStatus } from '#/data/assignments/types'
import GlassContainer from '../liquidGlass/GlassContainer'

const statusMeta: Record<
  StudentAssignmentStatus,
  {
    icon: IconType
    iconBackgroundClassName: string
    iconClassName: string
    badges: { label: string; className: string }[]
  }
> = {
  graded: {
    icon: LuCircleCheck,
    iconBackgroundClassName: 'bg-green-600/20',
    iconClassName: 'text-green-500',
    badges: [
      { label: 'A', className: 'bg-green-600/30 text-green-500' },
      { label: 'Graded', className: 'bg-green-600/30 text-green-500' },
      { label: 'View', className: 'bg-white/10' },
    ],
  },
  late: {
    icon: LuFile,
    iconBackgroundClassName: 'bg-red-600/20',
    iconClassName: 'text-red-500',
    badges: [{ label: 'Past Due', className: 'bg-red-600/30 text-red-500' }],
  },
  submitted: {
    icon: LuCircleCheck,
    iconBackgroundClassName: 'bg-blue-600/20',
    iconClassName: 'text-blue-500',
    badges: [
      { label: 'Submitted', className: 'bg-blue-600/30 text-blue-500' },
      { label: 'View', className: 'bg-white/10' },
    ],
  },
  pending: {
    icon: LuFile,
    iconBackgroundClassName: 'bg-yellow-600/20',
    iconClassName: 'text-yellow-500',
    badges: [{ label: 'Pending', className: 'bg-yellow-600/30 text-yellow-500' }],
  },
}

const AssignmentsList = ({ items }: { items: StudentAssignmentItem[] }) => {
  return (
    <>
      {items.map((item) => {
        const Icon = statusMeta[item.status].icon

        return (
          <GlassContainer
            key={`${item.title}-${item.status}`}
            className="flex items-center justify-between gap-4"
          >
            <div className="flex min-w-0 items-center gap-4">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${statusMeta[item.status].iconBackgroundClassName}`}
              >
                <Icon className={statusMeta[item.status].iconClassName} size={22} />
              </div>

              <div className="flex min-w-0 flex-col justify-center">
                <h2 className="truncate">{item.title}</h2>
                <span className="text-sm text-white/45">{item.subtitle}</span>
                <span className="text-xs text-white/25">{item.dueDate}</span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              {statusMeta[item.status].badges.map((badge) => (
                <span
                  key={badge.label}
                  className={`whitespace-nowrap rounded-lg px-3 py-1 ${badge.className}`}
                >
                  {badge.label}
                </span>
              ))}
            </div>
          </GlassContainer>
        )
      })}
    </>
  )
}

export default AssignmentsList
