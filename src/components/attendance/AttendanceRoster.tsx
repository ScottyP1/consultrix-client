import { cn } from '#/lib/utils'
import type {
  AttendanceRecord,
  AttendanceSession,
  AttendanceStatus,
  AttendanceStudent,
} from '#/data/attendance/types'
import type { PlannedStudentEventDto } from '#/api/consultrix'

const rosterStatusStyles: Record<AttendanceStatus, string> = {
  present: 'border-emerald-400/20 bg-emerald-500/14 text-emerald-200',
  late: 'border-amber-400/20 bg-amber-500/14 text-amber-200',
  absent: 'border-rose-400/20 bg-rose-500/14 text-rose-200',
  excused: 'border-white/10 bg-white/6 text-white/70',
}

const attendanceOptions: AttendanceStatus[] = [
  'present',
  'late',
  'absent',
  'excused',
]

const PLANNED_BADGE: Record<string, { label: string; className: string }> = {
  LATE:   { label: 'Planned: Late',   className: 'bg-amber-500/15 text-amber-300' },
  REMOTE: { label: 'Planned: Remote', className: 'bg-sky-500/15 text-sky-300' },
  OFF:    { label: 'Planned: Off',    className: 'bg-rose-500/15 text-rose-300' },
}

const AttendanceRoster = ({
  students,
  session,
  records,
  plannedEvents = [],
  selectedStudentId,
  onSelectStudent,
  onStatusChange,
}: {
  students: AttendanceStudent[]
  session: AttendanceSession
  records: AttendanceRecord[]
  plannedEvents?: PlannedStudentEventDto[]
  selectedStudentId?: string
  onSelectStudent: (studentId: string) => void
  onStatusChange: (studentId: string, status: AttendanceStatus) => void
}) => {
  const recordLookup = new Map(
    records.map((record) => [record.studentId, record]),
  )
  const plannedLookup = new Map(
    plannedEvents.map((e) => [e.studentUserId, e]),
  )

  return (
    <div className="space-y-3">
      {students.map((student) => {
        const record =
          recordLookup.get(student.id) ?? {
            studentId: student.id,
            sessionId: session.id,
            status: 'absent' as const,
            note: '',
          }
        const planned = plannedLookup.get(Number(student.id))
        const badge = planned ? PLANNED_BADGE[planned.eventType] : null

        return (
          <div
            key={student.id}
            className={cn(
              'grid gap-4 rounded-2xl border bg-white/4 px-4 py-4 lg:grid-cols-[minmax(0,1fr)_auto]',
              badge ? 'border-amber-400/25' : 'border-white/8',
              selectedStudentId === student.id && 'ring-2 ring-sky-400/50',
            )}
          >
            <button
              type="button"
              onClick={() => onSelectStudent(student.id)}
              className="min-w-0 text-left"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <p className="truncate text-sm font-medium text-white">
                  {student.name}
                </p>
                {badge && (
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${badge.className}`}>
                    {badge.label}
                    {planned?.note ? ` — ${planned.note}` : ''}
                  </span>
                )}
              </div>
              <p className="truncate text-xs text-white/40">{student.email}</p>
            </button>

            <div className="flex flex-wrap gap-2">
              {attendanceOptions.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => {
                    onSelectStudent(student.id)
                    onStatusChange(student.id, status)
                  }}
                  className={cn(
                    'rounded-xl border px-3 py-2 text-xs font-medium uppercase tracking-[0.18em] transition',
                    record.status === status
                      ? rosterStatusStyles[status]
                      : 'border-white/10 bg-white/3 text-white/50 hover:border-white/20 hover:text-white/80',
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default AttendanceRoster
