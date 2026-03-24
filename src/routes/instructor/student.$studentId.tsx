import { createFileRoute, Link } from '@tanstack/react-router'
import { LuArrowLeft, LuGraduationCap, LuClipboardCheck, LuUserCheck, LuAward } from 'react-icons/lu'

import PageHeader from '#/components/PageHeader'
import GlassContainer from '#/components/liquidGlass/GlassContainer'
import ItemContainer from '#/components/ItemContainer'
import StatCard from '#/components/StatCard'
import SectionFrame from '#/components/dashboard/SectionFrame'
import FlagSection from '#/components/detail/FlagSection'
import { useInstructorStudentDetail } from '#/hooks/instructor/useInstructorStudentDetail'
import { formatDate, formatDateTime, formatStatusLabel, getFullName } from '#/lib/consultrix-format'

export const Route = createFileRoute('/instructor/student/$studentId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { studentId } = Route.useParams()
  const id = Number(studentId)

  const {
    student,
    isLoading,
    assignmentsQuery,
    gradesQuery,
    submissionsQuery,
    attendanceQuery,
    flagsQuery,
    createFlagMutation,
    resolveFlagMutation,
  } = useInstructorStudentDetail(id)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <BackLink />
        <PageHeader eyebrow="Student" title="Loading student…" />
      </div>
    )
  }

  if (!student) {
    return (
      <div className="flex flex-col gap-6">
        <BackLink />
        <PageHeader eyebrow="Student" title="Student not found" subtitle={`No student with ID ${id}`} />
      </div>
    )
  }

  const submissions = submissionsQuery.data ?? []
  const grades = gradesQuery.data ?? []
  const attendance = attendanceQuery.data ?? []
  const flags = flagsQuery.data ?? []
  const assignments = assignmentsQuery.data ?? []

  const presentDays = attendance.filter((a) => a.status === 'PRESENT').length
  const attendanceRate = attendance.length > 0
    ? Math.round((presentDays / attendance.length) * 100)
    : null
  const avgGrade = grades.length > 0
    ? Math.round(grades.reduce((sum, g) => sum + (g.assignmentGradePercentage ?? 0), 0) / grades.length)
    : null
  const activeFlags = flags.filter((f) => !f.resolved)

  return (
    <div className="flex flex-col gap-6">
      <BackLink />

      <div className="flex items-start justify-between gap-4">
        <PageHeader
          eyebrow="Student"
          title={getFullName(student.firstName, student.lastName)}
          subtitle={student.email}
        />
        <div className="mt-1 flex flex-wrap gap-2">
          {student.cohort && (
            <span className="rounded-full bg-sky-500/15 px-3 py-1 text-xs text-sky-300">
              {student.cohort.name}
            </span>
          )}
          {student.graduationStatus && (
            <span className="rounded-full bg-white/8 px-3 py-1 text-xs uppercase tracking-[0.15em] text-white/60">
              {formatStatusLabel(student.graduationStatus)}
            </span>
          )}
          {activeFlags.length > 0 && (
            <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs text-red-300">
              {activeFlags.length} active flag{activeFlags.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={LuClipboardCheck} iconBgClassName="#0c2240" iconAccent="#38bdf8"
          label="Submissions" value={String(submissions.length)} />
        <StatCard icon={LuAward} iconBgClassName="#052e16" iconAccent="#4ade80"
          label="Avg Grade" value={avgGrade !== null ? `${avgGrade}%` : 'N/A'} />
        <StatCard icon={LuUserCheck} iconBgClassName="#1e1b4b" iconAccent="#818cf8"
          label="Attendance" value={attendanceRate !== null ? `${attendanceRate}%` : 'N/A'} />
        <StatCard icon={LuGraduationCap} iconBgClassName="#1c1107" iconAccent="#fb923c"
          label="Grades Recorded" value={String(grades.length)} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <SectionFrame label={`Submissions (${submissions.length})`}>
          {submissions.length > 0 ? (
            <div className="flex flex-col gap-2">
              {submissions.slice(0, 10).map((sub) => {
                const assignment = assignments.find((a) => a.id === sub.assignmentId)
                return (
                  <ItemContainer key={sub.submissionId} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {assignment?.title ?? `Assignment #${sub.assignmentId}`}
                      </p>
                      <p className="text-xs text-white/35">{formatDateTime(sub.submittedAt)}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs ${statusClass(sub.status)}`}>
                      {formatStatusLabel(sub.status)}
                    </span>
                  </ItemContainer>
                )
              })}
            </div>
          ) : (
            <p className="py-4 text-center text-sm text-white/35">No submissions yet.</p>
          )}
        </SectionFrame>

        <SectionFrame label={`Grades (${grades.length})`}>
          {grades.length > 0 ? (
            <div className="flex flex-col gap-2">
              {grades.map((grade) => (
                <ItemContainer key={grade.submissionId} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      Assignment #{grade.assignmentId}
                    </p>
                    <p className="text-xs text-white/35">
                      {grade.feedback ? grade.feedback.slice(0, 60) : 'No feedback'}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className="text-sm font-semibold text-white">{String(grade.score)}</span>
                    {grade.assignmentGradePercentage != null && (
                      <span className="text-xs text-white/40">
                        {Math.round(grade.assignmentGradePercentage)}%
                      </span>
                    )}
                  </div>
                </ItemContainer>
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-sm text-white/35">No grades recorded.</p>
          )}
        </SectionFrame>
      </div>

      <SectionFrame label={`Attendance (${attendance.length} days recorded)`}>
        {attendance.length > 0 ? (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {(['PRESENT', 'ABSENT', 'LATE'] as const).map((status) => (
                <span key={status} className={`rounded-full px-3 py-1 text-xs ${statusClass(status)}`}>
                  {formatStatusLabel(status)}: {attendance.filter((a) => a.status === status).length}
                </span>
              ))}
            </div>
            <div className="grid gap-1.5 sm:grid-cols-2">
              {attendance.slice(0, 20).map((record) => (
                <ItemContainer key={record.id} className="flex items-center justify-between gap-3">
                  <p className="text-xs text-white/60">{formatDate(record.attendanceDate)}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusClass(record.status)}`}>
                    {formatStatusLabel(record.status)}
                  </span>
                </ItemContainer>
              ))}
            </div>
          </div>
        ) : (
          <p className="py-4 text-center text-sm text-white/35">No attendance records.</p>
        )}
      </SectionFrame>

      <FlagSection
        flags={flags}
        studentId={id}
        onCreateFlag={(payload) => createFlagMutation.mutate(payload)}
        onResolveFlag={(flagId) => resolveFlagMutation.mutate(flagId)}
        isCreating={createFlagMutation.isPending}
        isResolving={resolveFlagMutation.isPending}
        createError={createFlagMutation.error}
      />
    </div>
  )
}

function BackLink() {
  return (
    <Link
      to="/instructor/gradebook"
      className="flex w-fit items-center gap-1.5 text-sm text-white/45 transition-colors hover:text-white/70"
    >
      <LuArrowLeft size={14} />
      Back to Gradebook
    </Link>
  )
}

function statusClass(status: string) {
  const map: Record<string, string> = {
    PRESENT: 'bg-emerald-500/15 text-emerald-300',
    ABSENT: 'bg-red-500/15 text-red-300',
    LATE: 'bg-amber-500/15 text-amber-300',
    SUBMITTED: 'bg-sky-500/15 text-sky-300',
    GRADED: 'bg-emerald-500/15 text-emerald-300',
    MISSING: 'bg-red-500/15 text-red-300',
  }
  return map[status] ?? 'bg-white/8 text-white/50'
}
