import { createFileRoute } from '@tanstack/react-router'

import GlassContainer from '#/components/liquidGlass/GlassContainer'
import PageHeader from '#/components/PageHeader'
import { useInstructorWorkspaceData } from '#/hooks/instructor/useInstructorWorkspaceData'
import { formatDateTime } from '#/lib/consultrix-format'
import { getStudentName } from '#/lib/instructor-workspace'

export const Route = createFileRoute('/instructor/submissions')({
  component: RouteComponent,
})

function RouteComponent() {
  const { submissionsQuery, gradesQuery, isLoading, error } =
    useInstructorWorkspaceData()

  if (isLoading) {
    return (
      <PageHeader
        eyebrow="Submissions"
        title="Loading submissions"
        subtitle="Fetching live student submission data."
      />
    )
  }

  if (error) {
    return (
      <PageHeader
        eyebrow="Submissions"
        title="Submissions unavailable"
        subtitle={error.message}
      />
    )
  }

  const grades = gradesQuery.data ?? []
  const items = (submissionsQuery.data ?? [])
    .slice()
    .sort(
      (left, right) =>
        new Date(right.submittedAt ?? 0).getTime() -
        new Date(left.submittedAt ?? 0).getTime(),
    )

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Submissions"
        title="Submissions"
        subtitle="Live submissions grouped by assignment and student."
      />

      {items.length > 0 ? (
        <div className="grid gap-4">
          {items.map((submission) => {
            const grade = grades.find(
              (item) => item.submission.id === submission.id,
            )

            return (
              <GlassContainer key={submission.id} className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {submission.assignment.title}
                    </h2>
                    <p className="text-sm text-white/45">
                      {getStudentName(submission.student)} ·{' '}
                      {submission.assignment.module.title}
                    </p>
                  </div>
                  <span className="rounded-full bg-white/8 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/60">
                    {grade ? 'Graded' : submission.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-white/45">
                  <span>Submitted {formatDateTime(submission.submittedAt)}</span>
                  <span>{submission.contentUrl || 'No attachment URL'}</span>
                  {grade ? <span>Score {grade.score}</span> : null}
                </div>
                {grade?.feedback ? (
                  <p className="text-sm leading-6 text-white/60">
                    {grade.feedback}
                  </p>
                ) : null}
              </GlassContainer>
            )
          })}
        </div>
      ) : (
        <p className="text-sm text-white/45">No submissions available.</p>
      )}
    </div>
  )
}
