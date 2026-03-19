import { cn } from '#/lib/utils'
import type {
  AttendanceRecord,
  AttendanceSession,
  AttendanceStudent,
} from '#/data/attendance/types'

const statusStyles: Record<AttendanceRecord['status'], string> = {
  present: 'border-emerald-500/20 bg-emerald-500/12 text-emerald-200',
  late: 'border-amber-500/20 bg-amber-500/12 text-amber-200',
  absent: 'border-rose-500/20 bg-rose-500/12 text-rose-200',
  excused: 'border-white/10 bg-white/6 text-white/65',
}

const statusLabels: Record<AttendanceRecord['status'], string> = {
  present: 'Present',
  late: 'Late',
  absent: 'Absent',
  excused: 'Excused',
}

const AttendanceTable = ({
  students,
  sessions,
  records,
  selectedCell,
  onSelectCell,
}: {
  students: AttendanceStudent[]
  sessions: AttendanceSession[]
  records: AttendanceRecord[]
  selectedCell: { studentId: string; sessionId: string } | null
  onSelectCell: (studentId: string, sessionId: string) => void
}) => {
  const recordLookup = new Map(
    records.map((record) => [
      `${record.studentId}:${record.sessionId}`,
      record,
    ]),
  )

  return (
    <div className="overflow-x-auto">
      <table className="min-w-max border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="sticky left-0 z-30 min-w-64 border-b border-white/10  px-4 py-4 text-left text-[11px] uppercase tracking-[0.24em] text-white/45">
              Student
            </th>
            {sessions.map((session) => (
              <th
                key={session.id}
                className="w-44 border-b border-white/10  px-4 py-4 text-left align-top"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white">
                    {session.label}
                  </p>
                  <p className="text-xs text-white/45">{session.date}</p>
                  <p className="text-xs text-white/30">{session.topic}</p>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td className="sticky left-0 z-20 border-b border-white/6  px-4 py-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white">
                    {student.name}
                  </p>
                  <p className="text-xs text-white/40">{student.email}</p>
                </div>
              </td>

              {sessions.map((session) => {
                const record = recordLookup.get(
                  `${student.id}:${session.id}`,
                ) ?? {
                  studentId: student.id,
                  sessionId: session.id,
                  status: 'absent' as const,
                  note: '',
                }

                const isSelected =
                  selectedCell?.studentId === student.id &&
                  selectedCell.sessionId === session.id

                return (
                  <td
                    key={`${student.id}-${session.id}`}
                    className="border-b border-white/6 px-2 py-2"
                  >
                    <button
                      type="button"
                      onClick={() => onSelectCell(student.id, session.id)}
                      className={cn(
                        'flex min-h-20 w-full flex-col justify-between rounded-xl border px-3 py-3 text-left transition hover:border-white/20 hover:bg-white/6',
                        statusStyles[record.status],
                        isSelected && 'ring-2 ring-sky-400/60',
                      )}
                    >
                      <span className="text-sm font-semibold">
                        {statusLabels[record.status]}
                      </span>
                      <span className="text-[11px] uppercase tracking-[0.18em] opacity-75">
                        {session.label}
                      </span>
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AttendanceTable
