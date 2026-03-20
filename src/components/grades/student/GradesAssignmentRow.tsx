type GradeStatus = 'graded' | 'pending' | 'missing'

type GradesAssignmentRowProps = {
  title: string
  weightPercent: number
  gradePercent: number | null
  status: GradeStatus
}

const statusClassNames: Record<GradeStatus, string> = {
  graded: 'bg-emerald-500/18 text-emerald-300',
  pending: 'bg-amber-500/18 text-amber-300',
  missing: 'bg-rose-500/18 text-rose-300',
}

const gradeClassNames: Record<GradeStatus, string> = {
  graded: 'text-emerald-400',
  pending: 'text-sky-400',
  missing: 'text-rose-400',
}

const GradesAssignmentRow = ({
  title,
  weightPercent,
  gradePercent,
  status,
}: GradesAssignmentRowProps) => {
  return (
    <div className="grid grid-cols-[minmax(0,2.2fr)_0.8fr_0.8fr_0.8fr] items-center gap-4 border-t border-white/6 py-4 text-sm">
      <div className="font-medium text-white">{title}</div>
      <div className="text-white/55">{weightPercent}%</div>
      <div className={`font-medium ${gradeClassNames[status]}`}>
        {gradePercent === null ? '-' : `${gradePercent}%`}
      </div>
      <div>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusClassNames[status]}`}
        >
          {status === 'graded'
            ? 'Graded'
            : status === 'pending'
              ? 'Pending'
              : 'Missing'}
        </span>
      </div>
    </div>
  )
}

export default GradesAssignmentRow
