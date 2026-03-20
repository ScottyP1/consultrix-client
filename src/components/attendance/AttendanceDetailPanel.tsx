import SectionFrame from '#/components/dashboard/SectionFrame'
import type {
  AttendanceRecord,
  AttendanceSession,
  AttendanceStatus,
  AttendanceStudent,
} from '#/data/attendance/types'

const AttendanceDetailPanel = ({
  student,
  session,
  record,
  onStatusChange,
  onNoteChange,
}: {
  student?: AttendanceStudent
  session?: AttendanceSession
  record?: AttendanceRecord
  onStatusChange: (status: AttendanceStatus) => void
  onNoteChange: (note: string) => void
}) => {
  if (!student || !session || !record) {
    return (
      <SectionFrame label="Attendance Detail" className="min-h-[28rem]">
        <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/3 p-6 text-center text-sm text-white/45">
          Select an attendance cell to update status and instructor notes.
        </div>
      </SectionFrame>
    )
  }

  return (
    <SectionFrame label="Attendance Detail" className="min-h-[28rem]">
      <div className="space-y-5">
        <div className="space-y-1">
          <p className="text-lg font-semibold text-white">{student.name}</p>
          <p className="text-sm text-white/45">{student.email}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
          <p className="text-sm font-medium text-white">{session.label}</p>
          <p className="mt-1 text-xs text-white/45">{session.date}</p>
          <p className="mt-1 text-xs text-white/35">{session.topic}</p>
        </div>

        <label className="block space-y-2">
          <span className="text-[11px] uppercase tracking-[0.24em] text-white/45">
            Status
          </span>
          <select
            value={record.status}
            onChange={(event) =>
              onStatusChange(event.target.value as AttendanceStatus)
            }
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
          >
            <option value="present" className="bg-slate-950">
              Present
            </option>
            <option value="late" className="bg-slate-950">
              Late
            </option>
            <option value="absent" className="bg-slate-950">
              Absent
            </option>
            <option value="excused" className="bg-slate-950">
              Excused
            </option>
          </select>
        </label>

        <label className="block space-y-2">
          <span className="text-[11px] uppercase tracking-[0.24em] text-white/45">
            Instructor Note
          </span>
          <textarea
            value={record.note ?? ''}
            onChange={(event) => onNoteChange(event.target.value)}
            rows={6}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
            placeholder="Leave context for outreach, follow-up, or an approved exception."
          />
        </label>

        <p className="text-xs text-white/35">
          Changes apply locally right away. This panel is ready to connect to an attendance API later.
        </p>
      </div>
    </SectionFrame>
  )
}

export default AttendanceDetailPanel
