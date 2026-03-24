import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  LuArrowLeft,
  LuClipboardCheck,
  LuClock,
  LuAward,
  LuTriangleAlert,
  LuCircleCheck,
  LuSend,
  LuLink,
} from 'react-icons/lu'

import PageHeader from '#/components/PageHeader'
import GlassContainer from '#/components/liquidGlass/GlassContainer'
import { useStudentCoursework } from '#/hooks/student/useStudentCoursework'
import { useStudentProfile } from '#/hooks/student/useStudentProfile'
import {
  formatAssignmentDueDate,
  formatDateTime,
  formatStatusLabel,
} from '#/lib/consultrix-format'

export const Route = createFileRoute('/student/assignment/$assignmentId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { assignmentId } = Route.useParams()
  const id = Number(assignmentId)

  const [contentUrl, setContentUrl] = useState('')

  const { courseworkQuery, submitMutation } = useStudentCoursework()
  const profileQuery = useStudentProfile()

  if (courseworkQuery.isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <BackLink />
        <PageHeader eyebrow="Assignment" title="Loading…" />
      </div>
    )
  }

  if (courseworkQuery.error) {
    return (
      <div className="flex flex-col gap-6">
        <BackLink />
        <PageHeader
          eyebrow="Assignment"
          title="Error loading assignment"
          subtitle={courseworkQuery.error.message}
        />
      </div>
    )
  }

  const item = (courseworkQuery.data ?? []).find((a) => a.assignmentId === id)

  if (!item) {
    return (
      <div className="flex flex-col gap-6">
        <BackLink />
        <PageHeader
          eyebrow="Assignment"
          title="Assignment not found"
          subtitle={`No assignment with ID ${id}`}
        />
      </div>
    )
  }

  const statusConfig = courseworkStatusConfig(item.courseworkStatus)
  const canSubmit = !item.submissionId && item.courseworkStatus !== 'GRADED'

  return (
    <div className="flex flex-col gap-6">
      <BackLink />

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          eyebrow={item.moduleTitle}
          title={item.title}
          subtitle={item.description || undefined}
        />
        <span
          className={`mt-1 shrink-0 rounded-full px-3 py-1 text-xs ${statusConfig.className}`}
        >
          {statusConfig.label}
        </span>
      </div>

      {/* Meta */}
      <GlassContainer className="grid gap-4 p-5 sm:grid-cols-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15">
            <LuClock size={18} className="text-sky-400" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-white/40">
              Due
            </p>
            <p className="text-sm font-medium text-white">
              {formatAssignmentDueDate(item.dueDate, item.dueTime)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15">
            <LuClipboardCheck size={18} className="text-indigo-400" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-white/40">
              Max Score
            </p>
            <p className="text-sm font-medium text-white">{item.maxScore}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15">
            <LuAward size={18} className="text-violet-400" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-white/40">
              Cohort
            </p>
            <p className="text-sm font-medium text-white">{item.cohortName}</p>
          </div>
        </div>
      </GlassContainer>

      {/* Submission */}
      <GlassContainer className="space-y-4 p-5">
        <p className="text-xs uppercase tracking-[0.25em] text-white/40">Submission</p>

        {item.submissionId ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <LuCircleCheck size={16} className="text-emerald-400" />
              <p className="text-sm text-white/80">
                Submitted {formatDateTime(item.submittedAt)}
              </p>
            </div>
            {item.submissionStatus && (
              <p className="text-xs text-white/40">
                Status: {formatStatusLabel(item.submissionStatus)}
              </p>
            )}
          </div>
        ) : canSubmit ? (
          <div className="space-y-3">
            {item.courseworkStatus === 'LATE' && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2">
                <LuTriangleAlert size={14} className="shrink-0 text-red-400" />
                <p className="text-xs text-red-300">
                  This assignment is past due. You can still submit but it will be marked late.
                </p>
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-white/40">
                GitHub / File URL
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 focus-within:ring-1 focus-within:ring-white/20">
                <LuLink size={15} className="shrink-0 text-white/30" />
                <input
                  type="url"
                  placeholder="https://github.com/your-repo or file link…"
                  value={contentUrl}
                  onChange={(e) => setContentUrl(e.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/25 focus:outline-none"
                />
              </div>
            </div>
            <button
              disabled={!contentUrl.trim() || submitMutation.isPending}
              onClick={() => submitMutation.mutate(
                {
                  assignmentId: id,
                  studentUserId: profileQuery.data?.userId,
                  submittedAt: new Date().toISOString(),
                  contentUrl: contentUrl.trim(),
                },
                { onSuccess: () => setContentUrl('') },
              )}
              className="flex items-center gap-2 rounded-xl bg-sky-500/20 px-5 py-2.5 text-sm font-medium text-sky-300 transition-colors hover:bg-sky-500/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LuSend size={14} />
              {submitMutation.isPending ? 'Submitting…' : 'Submit Assignment'}
            </button>
            {submitMutation.isError && (
              <p className="flex items-center gap-1.5 text-xs text-red-400">
                <LuTriangleAlert size={12} />
                {submitMutation.error?.message}
              </p>
            )}
            {submitMutation.isSuccess && (
              <p className="flex items-center gap-1.5 text-xs text-emerald-400">
                <LuCircleCheck size={12} />
                Submitted successfully!
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <LuTriangleAlert size={16} className="text-amber-400" />
            <p className="text-sm text-white/60">No submission on record.</p>
          </div>
        )}
      </GlassContainer>

      {/* Grade */}
      {item.gradeId && (
        <GlassContainer className="space-y-3 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-white/40">
            Grade
          </p>
          <div className="flex items-end gap-4">
            <div>
              <p className="text-4xl font-bold text-white">{item.score}</p>
              <p className="text-sm text-white/40">out of {item.maxScore}</p>
            </div>
            {item.assignmentGradePercentage != null && (
              <div>
                <p
                  className={`text-2xl font-semibold ${gradeColor(item.assignmentGradePercentage)}`}
                >
                  {Math.round(item.assignmentGradePercentage)}%
                </p>
                <p className="text-xs text-white/35">
                  {letterGrade(item.assignmentGradePercentage)}
                </p>
              </div>
            )}
          </div>
          {item.feedback && (
            <div className="border-t border-white/8 pt-3">
              <p className="mb-1 text-xs uppercase tracking-[0.15em] text-white/35">
                Feedback
              </p>
              <p className="text-sm leading-6 text-white/70">{item.feedback}</p>
            </div>
          )}
        </GlassContainer>
      )}
    </div>
  )
}

function BackLink() {
  return (
    <Link
      to="/student/assignments"
      className="flex w-fit items-center gap-1.5 text-sm text-white/45 transition-colors hover:text-white/70"
    >
      <LuArrowLeft size={14} />
      Back to Assignments
    </Link>
  )
}

function courseworkStatusConfig(status: string) {
  const map: Record<string, { label: string; className: string }> = {
    GRADED: {
      label: 'Graded',
      className: 'bg-emerald-500/15 text-emerald-300',
    },
    SUBMITTED: { label: 'Submitted', className: 'bg-sky-500/15 text-sky-300' },
    LATE: { label: 'Past Due', className: 'bg-red-500/15 text-red-300' },
    PENDING: { label: 'Pending', className: 'bg-amber-500/15 text-amber-300' },
  }
  return (
    map[status] ?? {
      label: formatStatusLabel(status),
      className: 'bg-white/8 text-white/50',
    }
  )
}

function gradeColor(pct: number) {
  if (pct >= 90) return 'text-emerald-400'
  if (pct >= 80) return 'text-sky-400'
  if (pct >= 70) return 'text-amber-400'
  if (pct >= 60) return 'text-orange-400'
  return 'text-red-400'
}

function letterGrade(pct: number) {
  if (pct >= 90) return 'A'
  if (pct >= 80) return 'B'
  if (pct >= 70) return 'C'
  if (pct >= 60) return 'D'
  return 'F'
}
