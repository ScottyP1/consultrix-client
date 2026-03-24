import { createFileRoute, Link } from '@tanstack/react-router'

import GlassContainer from '#/components/liquidGlass/GlassContainer'
import PageHeader from '#/components/PageHeader'
import { useInstructorWorkspaceData } from '#/hooks/instructor/useInstructorWorkspaceData'
import { getAssignmentSummary } from '#/lib/instructor-workspace'

export const Route = createFileRoute('/instructor/assignments')({
  component: RouteComponent,
})

function RouteComponent() {
  const { assignmentsQuery, submissionsQuery, isLoading, error } =
    useInstructorWorkspaceData()

  if (isLoading) {
    return (
      <PageHeader
        eyebrow="Assignments"
        title="Loading assignments"
        subtitle="Fetching live assignment data."
      />
    )
  }

  if (error) {
    return (
      <PageHeader
        eyebrow="Assignments"
        title="Assignments unavailable"
        subtitle={error.message}
      />
    )
  }

  const submissions = submissionsQuery.data ?? []
  const assignments = (assignmentsQuery.data ?? [])
    .slice()
    .sort(
      (left, right) =>
        new Date(`${left.dueDate}T${left.dueTime}`).getTime() -
        new Date(`${right.dueDate}T${right.dueTime}`).getTime(),
    )

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Assignments"
        title="Assignments"
        subtitle="All live assignments available to this instructor."
      />

      {assignments.length > 0 ? (
        <div className="grid gap-4">
          {assignments.map((assignment) => {
            const summary = getAssignmentSummary(assignment)
            const submissionCount = submissions.filter(
              (submission) => submission.assignment.id === assignment.id,
            ).length

            return (
              <Link
                key={assignment.id}
                to="/instructor/assignment/$assignmentId"
                params={{ assignmentId: String(assignment.id) }}
              >
                <GlassContainer className="space-y-3 p-5 hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        {assignment.title}
                      </h2>
                      <p className="text-sm text-white/45">
                        {summary.moduleTitle} · {summary.cohortName}
                      </p>
                    </div>
                    <span className="rounded-full bg-white/8 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/60">
                      {summary.maxScore} pts
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-white/60">
                    {assignment.description ||
                      'No assignment description provided.'}
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-white/45">
                    <span>Due {summary.dueLabel}</span>
                    <span>{submissionCount} submissions</span>
                  </div>
                </GlassContainer>
              </Link>
            )
          })}
        </div>
      ) : (
        <p className="text-sm text-white/45">No assignments available.</p>
      )}
    </div>
  )
}
