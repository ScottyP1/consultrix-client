import SectionFrame from '#/components/dashboard/SectionFrame'
import type {
  GradebookAssignment,
  GradebookRecord,
  GradebookStatus,
  GradebookStudent,
} from '#/data/gradebook/types'

const GradebookDetailPanel = ({
  student,
  assignment,
  record,
  onStatusChange,
  onScoreChange,
  onFeedbackChange,
}: {
  student?: GradebookStudent
  assignment?: GradebookAssignment
  record?: GradebookRecord
  onStatusChange: (status: GradebookStatus) => void
  onScoreChange: (score: number | null) => void
  onFeedbackChange: (feedback: string) => void
}) => {
  if (!student || !assignment || !record) {
    return (
      <SectionFrame label="Grade Detail" className="min-h-[28rem]">
        <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/3 p-6 text-center text-sm text-white/45">
          Select a grade cell to review submission status, update the score, and leave feedback.
        </div>
      </SectionFrame>
    )
  }

  return (
    <SectionFrame label="Grade Detail" className="min-h-[28rem]">
      <div className="space-y-5">
        <div className="space-y-1">
          <p className="text-lg font-semibold text-white">{student.name}</p>
          <p className="text-sm text-white/45">{student.email}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
          <p className="text-sm font-medium text-white">{assignment.title}</p>
          <p className="mt-1 text-xs text-white/45">
            {assignment.pointsPossible} points · due {assignment.dueDate}
          </p>
        </div>

        <label className="block space-y-2">
          <span className="text-[11px] uppercase tracking-[0.24em] text-white/45">
            Status
          </span>
          <select
            value={record.status}
            onChange={(event) => onStatusChange(event.target.value as GradebookStatus)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
          >
            <option value="graded" className="bg-slate-950">
              Graded
            </option>
            <option value="submitted" className="bg-slate-950">
              Submitted
            </option>
            <option value="missing" className="bg-slate-950">
              Missing
            </option>
            <option value="excused" className="bg-slate-950">
              Excused
            </option>
          </select>
        </label>

        <label className="block space-y-2">
          <span className="text-[11px] uppercase tracking-[0.24em] text-white/45">
            Score
          </span>
          <input
            type="number"
            min={0}
            max={assignment.pointsPossible}
            value={record.score ?? ''}
            onChange={(event) =>
              onScoreChange(
                event.target.value === '' ? null : Number.parseInt(event.target.value, 10),
              )
            }
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
            placeholder={`0 - ${assignment.pointsPossible}`}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-[11px] uppercase tracking-[0.24em] text-white/45">
            Feedback
          </span>
          <textarea
            value={record.feedback ?? ''}
            onChange={(event) => onFeedbackChange(event.target.value)}
            rows={6}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
            placeholder="Leave rubric notes or revision guidance."
          />
        </label>

        <p className="text-xs text-white/35">
          Changes apply locally right away. When the API layer is added, this panel can save directly to the selected record.
        </p>
      </div>
    </SectionFrame>
  )
}

export default GradebookDetailPanel
