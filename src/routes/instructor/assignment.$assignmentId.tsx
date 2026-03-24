import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { LuArrowLeft, LuClipboardCheck, LuUsers, LuCheckCircle, LuClock } from 'react-icons/lu'

import PageHeader from '#/components/PageHeader'
import GlassContainer from '#/components/liquidGlass/GlassContainer'
import ItemContainer from '#/components/ItemContainer'
import StatCard from '#/components/StatCard'
import SectionFrame from '#/components/dashboard/SectionFrame'
import InlineGradeForm from '#/components/detail/InlineGradeForm'
import { useInstructorAssignmentDetail } from '#/hooks/instructor/useInstructorAssignmentDetail'
import { formatDate, formatDateTime, formatStatusLabel, getFullName } from '#/lib/consultrix-format'
import type { GradeRequestDto } from '#/api/consultrix'

export const Route = createFileRoute('/instructor/assignment/$assignmentId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { assignmentId } = Route.useParams()
  const id = Number(assignmentId)

  const {
    assignment,
    isLoading,
    meQuery,
    submissionsQuery,
    gradesQuery,
    createGradeMutation,
    updateGradeMutation,
  } = useInstructorAssignmentDetail(id)

  const [gradingSubmissionId, setGradingSubmissionId] = useState<number | null>(null)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <BackLink />
        <PageHeader eyebrow="Assignment" title="Loading assignment…" />
      </div>
    )
  }

  if (!assignment) {
    return (
      <div className="flex flex-col gap-6">
        <BackLink />
        <PageHeader eyebrow="Assignment" title="Assignment not found" subtitle={`No assignment with ID ${id}`} />
      </div>
    )
  }

  const submissions = submissionsQuery.data ?? []
  const grades = gradesQuery.data ?? []
  const instructorId = meQuery.data?.id

  const gradedCount = submissions.filter((s) => grades.some((g) => g.submission.id === s.id)).length
  const avgScore = grades.length > 0
    ? Math.round(grades.reduce((sum, g) => sum + Number(g.score), 0) / grades.length)
    : null

  function handleSaveGrade({
    gradeId,
    score,
    feedback,
  }: {
    gradeId?: number
    score: number
    feedback: string
  }) {
    if (!instructorId) return
    const payload: GradeRequestDto = {
      submissionId: gradingSubmissionId!,
      instructorUserId: instructorId,
      score,
      feedback: feedback || undefined,
    }
    if (gradeId !== undefined) {
      updateGradeMutation.mutate({ gradeId, payload })
    } else {
      createGradeMutation.mutate(payload)
    }
    setGradingSubmissionId(null)
  }

  const gradeMutationError = createGradeMutation.error ?? updateGradeMutation.error
  const gradeMutationPending = createGradeMutation.isPending || updateGradeMutation.isPending

  return (
    <div className="flex flex-col gap-6">
      <BackLink />

      <div className="flex items-start justify-between gap-4">
        <PageHeader
          eyebrow={assignment.module.title}
          title={assignment.title}
          subtitle={assignment.description ?? undefined}
        />
        <div className="mt-1 shrink-0 text-right">
          <p className="text-xs uppercase tracking-[0.15em] text-white/40">
            Due {formatDate(assignment.dueDate)}
          </p>
          <p className="text-xs text-white/35">Max score: {assignment.maxScore}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={LuUsers} iconBgClassName="#0c2240" iconAccent="#38bdf8"
          label="Submissions" value={String(submissions.length)} />
        <StatCard icon={LuCheckCircle} iconBgClassName="#052e16" iconAccent="#4ade80"
          label="Graded" value={String(gradedCount)} />
        <StatCard icon={LuClock} iconBgClassName="#1e1b4b" iconAccent="#818cf8"
          label="Pending" value={String(submissions.length - gradedCount)} />
        <StatCard icon={LuClipboardCheck} iconBgClassName="#1c1107" iconAccent="#fb923c"
          label="Avg Score" value={avgScore !== null ? String(avgScore) : 'N/A'} />
      </div>

      <SectionFrame label={`Submissions (${submissions.length})`}>
        {submissions.length > 0 ? (
          <div className="flex flex-col gap-3">
            {submissions.map((submission) => {
              const grade = grades.find((g) => g.submission.id === submission.id)
              const isGrading = gradingSubmissionId === submission.id
              const student = submission.student

              return (
                <GlassContainer key={submission.id} className="space-y-3 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <Link
                        to="/instructor/student/$studentId"
                        params={{ studentId: String(student.id) }}
                        className="text-sm font-semibold text-white hover:text-white/70 transition-colors"
                      >
                        {getFullName(student.firstName, student.lastName)}
                      </Link>
                      <p className="text-xs text-white/35">
                        {formatDateTime(submission.submittedAt)} · {formatStatusLabel(submission.status)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {grade ? (
                        <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-300">
                          Score: {grade.score}
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs text-amber-300">
                          Ungraded
                        </span>
                      )}
                      <button
                        onClick={() =>
                          setGradingSubmissionId(isGrading ? null : submission.id)
                        }
                        className="rounded-lg bg-white/8 px-3 py-1 text-xs text-white/60 transition-colors hover:bg-white/15"
                      >
                        {isGrading ? 'Cancel' : grade ? 'Edit Grade' : 'Grade'}
                      </button>
                    </div>
                  </div>

                  {isGrading && (
                    <InlineGradeForm
                      maxScore={Number(assignment.maxScore)}
                      existingGrade={grade ? { id: grade.id, score: Number(grade.score), feedback: grade.feedback } : undefined}
                      onSave={handleSaveGrade}
                      onCancel={() => setGradingSubmissionId(null)}
                      isPending={gradeMutationPending}
                      error={gradeMutationError}
                    />
                  )}

                  {!isGrading && grade?.feedback && (
                    <p className="border-t border-white/8 pt-2 text-xs italic text-white/40">
                      "{grade.feedback}"
                    </p>
                  )}

                  {submission.contentUrl && (
                    <ItemContainer>
                      <a
                        href={submission.contentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-sky-400 hover:text-sky-300 transition-colors"
                      >
                        View submission →
                      </a>
                    </ItemContainer>
                  )}
                </GlassContainer>
              )
            })}
          </div>
        ) : (
          <p className="py-4 text-center text-sm text-white/35">No submissions yet.</p>
        )}
      </SectionFrame>
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
