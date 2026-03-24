import { createFileRoute, Link } from '@tanstack/react-router'
import {
  LuArrowLeft,
  LuClipboardCheck,
  LuUsers,
  LuAward,
  LuCalendar,
} from 'react-icons/lu'

import PageHeader from '#/components/PageHeader'
import GlassContainer from '#/components/liquidGlass/GlassContainer'
import ItemContainer from '#/components/ItemContainer'
import StatCard from '#/components/StatCard'
import SectionFrame from '#/components/dashboard/SectionFrame'
import { useAdminData } from '#/hooks/admin/useAdminData'
import { formatDate } from '#/lib/consultrix-format'

export const Route = createFileRoute('/admin/module/$moduleId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { moduleId } = Route.useParams()
  const id = Number(moduleId)

  const { modulesQuery, assignmentsQuery, submissionsQuery, isLoading } = useAdminData()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <BackLink />
        <PageHeader eyebrow="Module" title="Loading module…" />
      </div>
    )
  }

  const module = (modulesQuery.data ?? []).find((m) => m.id === id)

  if (!module) {
    return (
      <div className="flex flex-col gap-6">
        <BackLink />
        <PageHeader eyebrow="Module" title="Module not found" subtitle={`No module with ID ${id}`} />
      </div>
    )
  }

  const assignments = (assignmentsQuery.data ?? []).filter((a) => a.module.id === id)
  const submissions = (submissionsQuery.data ?? []).filter((s) =>
    assignments.some((a) => a.id === s.assignment.id),
  )

  const gradedSubmissions = submissions.filter((s) => s.status === 'GRADED' || s.status === 'SUBMITTED')
  const uniqueStudents = new Set(submissions.map((s) => s.student.id)).size

  return (
    <div className="flex flex-col gap-6">
      {/* Back link — go to parent cohort if available */}
      {module.cohort ? (
        <Link
          to="/admin/cohort/$cohortId"
          params={{ cohortId: String(module.cohort.id) }}
          className="flex w-fit items-center gap-1.5 text-sm text-white/45 transition-colors hover:text-white/70"
        >
          <LuArrowLeft size={14} />
          Back to {module.cohort.name}
        </Link>
      ) : (
        <BackLink />
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          eyebrow={module.cohort?.name ?? 'Module'}
          title={module.title}
          subtitle={module.description ?? undefined}
        />
        <div className="mt-1 shrink-0 space-y-1 text-right">
          <p className="text-xs uppercase tracking-[0.15em] text-white/40">
            Week {module.orderIndex}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={LuClipboardCheck} iconBgClassName="#0c2240" iconAccent="#38bdf8"
          label="Assignments" value={String(assignments.length)} />
        <StatCard icon={LuUsers} iconBgClassName="#052e16" iconAccent="#4ade80"
          label="Students Active" value={String(uniqueStudents)} />
        <StatCard icon={LuAward} iconBgClassName="#1e1b4b" iconAccent="#818cf8"
          label="Submissions" value={String(submissions.length)} />
        <StatCard icon={LuCalendar} iconBgClassName="#1c1107" iconAccent="#fb923c"
          label="Graded" value={String(gradedSubmissions.length)} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {/* Module info */}
        <GlassContainer className="space-y-4 p-5">
          <p className="text-xs uppercase tracking-[0.28em] text-white/45">Details</p>
          <div className="grid grid-cols-2 gap-3">
            <InfoItem label="Start Date" value={formatDate(module.startDate)} />
            <InfoItem label="End Date" value={formatDate(module.endDate)} />
            <InfoItem label="Order" value={`Week ${module.orderIndex}`} />
            <InfoItem label="Cohort" value={module.cohort?.name ?? '--'} />
          </div>
        </GlassContainer>

        {/* Assignment list */}
        <SectionFrame label={`Assignments (${assignments.length})`}>
          {assignments.length > 0 ? (
            <div className="flex flex-col gap-2">
              {assignments.map((assignment) => {
                const assignmentSubmissions = submissions.filter(
                  (s) => s.assignment.id === assignment.id,
                )
                const graded = assignmentSubmissions.filter(
                  (s) => s.status === 'GRADED',
                ).length

                return (
                  <ItemContainer
                    key={assignment.id}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {assignment.title}
                      </p>
                      <p className="text-xs text-white/35">
                        Due {formatDate(assignment.dueDate)} · Max {assignment.maxScore}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs text-white/40">
                        {assignmentSubmissions.length} submitted
                      </p>
                      <p className="text-xs text-white/30">{graded} graded</p>
                    </div>
                  </ItemContainer>
                )
              })}
            </div>
          ) : (
            <p className="py-4 text-center text-sm text-white/35">No assignments in this module.</p>
          )}
        </SectionFrame>
      </div>

      {/* Recent submissions */}
      {submissions.length > 0 && (
        <SectionFrame label={`Recent Submissions (${submissions.length})`}>
          <div className="flex flex-col gap-2">
            {submissions.slice(0, 15).map((submission) => (
              <ItemContainer key={submission.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    to="/admin/student/$studentId"
                    params={{ studentId: String(submission.student.id) }}
                    className="truncate text-sm font-medium text-white hover:text-white/70 transition-colors"
                  >
                    {submission.student.firstName} {submission.student.lastName}
                  </Link>
                  <p className="text-xs text-white/35">{submission.assignment.title}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs ${submissionStatusClass(submission.status)}`}>
                  {submission.status}
                </span>
              </ItemContainer>
            ))}
          </div>
        </SectionFrame>
      )}
    </div>
  )
}

function BackLink() {
  return (
    <Link
      to="/admin/cohorts"
      className="flex w-fit items-center gap-1.5 text-sm text-white/45 transition-colors hover:text-white/70"
    >
      <LuArrowLeft size={14} />
      Back to Cohorts
    </Link>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.16em] text-white/40">{label}</p>
      <p className="text-sm text-white">{value || '--'}</p>
    </div>
  )
}

function submissionStatusClass(status: string) {
  const map: Record<string, string> = {
    SUBMITTED: 'bg-sky-500/15 text-sky-300',
    GRADED: 'bg-emerald-500/15 text-emerald-300',
    LATE: 'bg-amber-500/15 text-amber-300',
    MISSING: 'bg-red-500/15 text-red-300',
  }
  return map[status] ?? 'bg-white/8 text-white/50'
}
