import { Link } from '@tanstack/react-router'
import { cn } from '#/lib/utils'
import type {
  GradebookAssignment,
  GradebookModule,
  GradebookRecord,
  GradebookStudent,
} from '#/data/gradebook/types'

const statusStyles: Record<GradebookRecord['status'], string> = {
  graded: 'border-emerald-500/20 bg-emerald-500/12 text-emerald-200',
  submitted: 'border-sky-500/20 bg-sky-500/12 text-sky-200',
  missing: 'border-rose-500/20 bg-rose-500/12 text-rose-200',
  excused: 'border-white/10 bg-white/6 text-white/65',
}

const statusLabels: Record<GradebookRecord['status'], string> = {
  graded: 'Graded',
  submitted: 'Needs Review',
  missing: 'Missing',
  excused: 'Excused',
}

const GradebookTable = ({
  modules,
  assignments,
  students,
  records,
  selectedCell,
  onSelectCell,
}: {
  modules: GradebookModule[]
  assignments: GradebookAssignment[]
  students: GradebookStudent[]
  records: GradebookRecord[]
  selectedCell: { studentId: string; assignmentId: string } | null
  onSelectCell: (studentId: string, assignmentId: string) => void
}) => {
  const groupedAssignments = modules
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((module) => ({
      module,
      assignments: assignments
        .filter((assignment) => assignment.moduleId === module.id)
        .slice()
        .sort((a, b) => a.order - b.order),
    }))
    .filter((group) => group.assignments.length > 0)

  const recordLookup = new Map(
    records.map((record) => [
      `${record.studentId}:${record.assignmentId}`,
      record,
    ]),
  )

  return (
    <div className="overflow-x-auto">
      <table className="min-w-max border-separate border-spacing-0">
        <thead>
          <tr>
            <th
              rowSpan={2}
              className="sticky left-0 z-30 min-w-64 border-b border-white/10 px-4 py-4 text-left text-[11px] uppercase tracking-[0.24em] text-white/45"
            >
              Student
            </th>
            {groupedAssignments.map((group) => (
              <th
                key={group.module.id}
                colSpan={group.assignments.length}
                className="border-b border-white/10  px-4 py-3 text-left text-[11px] uppercase tracking-[0.24em] text-white/45"
              >
                {group.module.title}
              </th>
            ))}
          </tr>
          <tr>
            {groupedAssignments.flatMap((group) =>
              group.assignments.map((assignment) => (
                <th
                  key={assignment.id}
                  className="w-44 border-b border-white/10  px-4 py-4 text-left align-top"
                >
                  <div className="space-y-1">
                    <Link
                      to="/instructor/assignment/$assignmentId"
                      params={{ assignmentId: assignment.id }}
                      className="text-sm font-medium text-white hover:text-white/70 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {assignment.title}
                    </Link>
                    <p className="text-xs text-white/45">
                      {assignment.pointsPossible} pts
                    </p>
                    <p className="text-xs text-white/30">
                      {assignment.dueDate}
                    </p>
                  </div>
                </th>
              )),
            )}
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td className="sticky left-0 z-20 border-b border-white/6  px-4 py-4">
                <div className="space-y-1">
                  <Link
                    to="/instructor/student/$studentId"
                    params={{ studentId: student.id }}
                    className="text-sm font-medium text-white hover:text-white/70 transition-colors"
                  >
                    {student.name}
                  </Link>
                  <p className="text-xs text-white/40">{student.email}</p>
                </div>
              </td>

              {groupedAssignments.flatMap((group) =>
                group.assignments.map((assignment) => {
                  const record = recordLookup.get(
                    `${student.id}:${assignment.id}`,
                  ) ?? {
                    studentId: student.id,
                    assignmentId: assignment.id,
                    score: null,
                    status: 'missing' as const,
                    feedback: '',
                  }

                  const isSelected =
                    selectedCell?.studentId === student.id &&
                    selectedCell.assignmentId === assignment.id

                  return (
                    <td
                      key={`${student.id}-${assignment.id}`}
                      className="border-b border-white/6 px-2 py-2"
                    >
                      <button
                        type="button"
                        onClick={() => onSelectCell(student.id, assignment.id)}
                        className={cn(
                          'flex min-h-20 w-full flex-col justify-between rounded-xl border px-3 py-3 text-left transition hover:border-white/20 hover:bg-white/6',
                          statusStyles[record.status],
                          isSelected && 'ring-2 ring-sky-400/60',
                        )}
                      >
                        <span className="text-sm font-semibold">
                          {record.score !== null
                            ? `${record.score}/${assignment.pointsPossible}`
                            : statusLabels[record.status]}
                        </span>
                        <span className="text-[11px] uppercase tracking-[0.18em] opacity-75">
                          {record.status}
                        </span>
                      </button>
                    </td>
                  )
                }),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default GradebookTable
