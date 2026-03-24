import { createFileRoute, Link } from '@tanstack/react-router'
import { LuArrowLeft, LuGraduationCap, LuBookOpen, LuClipboardCheck, LuUsers } from 'react-icons/lu'

import PageHeader from '#/components/PageHeader'
import GlassContainer from '#/components/liquidGlass/GlassContainer'
import ItemContainer from '#/components/ItemContainer'
import StatCard from '#/components/StatCard'
import SectionFrame from '#/components/dashboard/SectionFrame'
import { useAdminData } from '#/hooks/admin/useAdminData'
import { formatDate, formatStatusLabel, getFullName } from '#/lib/consultrix-format'

export const Route = createFileRoute('/admin/cohort/$cohortId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { cohortId } = Route.useParams()
  const id = Number(cohortId)

  const { cohortsQuery, studentsQuery, modulesQuery, assignmentsQuery, submissionsQuery, isLoading } =
    useAdminData()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <BackLink />
        <PageHeader eyebrow="Cohort" title="Loading cohort…" />
      </div>
    )
  }

  const cohort = (cohortsQuery.data ?? []).find((c) => c.id === id)

  if (!cohort) {
    return (
      <div className="flex flex-col gap-6">
        <BackLink />
        <PageHeader eyebrow="Cohort" title="Cohort not found" subtitle={`No cohort with ID ${id}`} />
      </div>
    )
  }

  const students = (studentsQuery.data ?? []).filter((s) => s.cohort?.id === id)
  const modules = (modulesQuery.data ?? [])
    .filter((m) => m.cohort?.id === id)
    .sort((a, b) => a.orderIndex - b.orderIndex)
  const assignments = (assignmentsQuery.data ?? []).filter((a) => a.module.cohort?.id === id)
  const submissions = (submissionsQuery.data ?? []).filter((s) =>
    assignments.some((a) => a.id === s.assignment.id),
  )

  const gradedSubmissions = submissions.filter((s) =>
    (submissionsQuery.data ?? []).some((sub) => sub.id === s.id && sub.status !== 'MISSING'),
  )
  const instructorName = cohort.primaryInstructor
    ? getFullName(cohort.primaryInstructor.firstName, cohort.primaryInstructor.lastName)
    : null

  const fillPct = cohort.capacity > 0 ? Math.round((students.length / cohort.capacity) * 100) : 0

  return (
    <div className="flex flex-col gap-6">
      <BackLink />

      <div className="flex items-start justify-between gap-4">
        <PageHeader
          eyebrow="Cohort"
          title={cohort.name}
          subtitle={[cohort.facility?.name, instructorName].filter(Boolean).join(' · ') || 'No facility assigned'}
        />
        <span className="mt-1 shrink-0 rounded-full bg-white/8 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/60">
          {formatStatusLabel(cohort.status)}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={LuUsers} iconBgClassName="#0c2240" iconAccent="#38bdf8"
          label="Students" value={`${students.length}/${cohort.capacity}`} />
        <StatCard icon={LuBookOpen} iconBgClassName="#1e1b4b" iconAccent="#818cf8"
          label="Modules" value={String(modules.length)} />
        <StatCard icon={LuClipboardCheck} iconBgClassName="#052e16" iconAccent="#4ade80"
          label="Assignments" value={String(assignments.length)} />
        <StatCard icon={LuGraduationCap} iconBgClassName="#1c1107" iconAccent="#fb923c"
          label="Submissions" value={String(submissions.length)} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {/* Cohort info */}
        <GlassContainer className="space-y-4 p-5">
          <p className="text-xs uppercase tracking-[0.28em] text-white/45">Details</p>
          <div className="grid grid-cols-2 gap-3">
            <InfoItem label="Start Date" value={formatDate(cohort.startDate)} />
            <InfoItem label="End Date" value={formatDate(cohort.endDate)} />
            <InfoItem label="Facility" value={cohort.facility?.name ?? '--'} />
            <InfoItem label="Status" value={formatStatusLabel(cohort.status)} />
            <InfoItem label="Capacity" value={String(cohort.capacity)} />
            <InfoItem label="Enrolled" value={String(students.length)} />
          </div>

          {/* Capacity bar */}
          <div className="border-t border-white/8 pt-4">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.18em] text-white/45">Enrollment</p>
              <p className="text-xs text-white/45">{fillPct}%</p>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-linear-to-r from-sky-500 to-indigo-500"
                style={{ width: `${Math.min(fillPct, 100)}%` }}
              />
            </div>
          </div>

          {cohort.primaryInstructor && (
            <div className="border-t border-white/8 pt-4">
              <p className="mb-2 text-xs uppercase tracking-[0.18em] text-white/45">Instructor</p>
              <p className="text-sm font-semibold text-white">{instructorName}</p>
              {cohort.primaryInstructor.title && (
                <p className="text-xs text-white/45">{cohort.primaryInstructor.title}</p>
              )}
              {cohort.primaryInstructor.specialty && (
                <p className="text-xs text-white/35">{cohort.primaryInstructor.specialty}</p>
              )}
            </div>
          )}
        </GlassContainer>

        {/* Module list */}
        <SectionFrame label="Curriculum">
          {modules.length > 0 ? (
            <div className="flex flex-col gap-2">
              {modules.map((mod) => {
                const modAssignments = assignments.filter((a) => a.module.id === mod.id)
                return (
                  <Link
                    key={mod.id}
                    to="/admin/module/$moduleId"
                    params={{ moduleId: String(mod.id) }}
                    className="block"
                  >
                    <ItemContainer className="flex items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{mod.title}</p>
                        <p className="text-xs text-white/35">
                          {formatDate(mod.startDate)} – {formatDate(mod.endDate)}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-white/40">
                        {modAssignments.length} assignment{modAssignments.length !== 1 ? 's' : ''}
                      </span>
                    </ItemContainer>
                  </Link>
                )
              })}
            </div>
          ) : (
            <p className="py-4 text-center text-sm text-white/35">No modules assigned yet.</p>
          )}
        </SectionFrame>
      </div>

      {/* Student roster */}
      <SectionFrame label={`Student Roster (${students.length})`}>
        {students.length > 0 ? (
          <div className="flex flex-col gap-2">
            {students.map((student) => {
              const studentSubmissions = submissions.filter(
                (sub) => sub.student.id === student.id,
              )
              return (
                <Link
                  key={student.id}
                  to="/admin/student/$studentId"
                  params={{ studentId: String(student.id) }}
                  className="flex items-center justify-between gap-4 rounded-xl px-3 py-2.5 hover:bg-white/5 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {getFullName(student.firstName, student.lastName)}
                    </p>
                    <p className="text-xs text-white/35">{student.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/35">{studentSubmissions.length} submissions</span>
                    <GradPill status={student.graduationStatus} />
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <p className="py-4 text-center text-sm text-white/35">No students enrolled.</p>
        )}
      </SectionFrame>
    </div>
  )
}

function BackLink() {
  return (
    <Link to="/admin/cohorts" className="flex items-center gap-1.5 text-sm text-white/45 hover:text-white/70 transition-colors w-fit">
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

function GradPill({ status }: { status?: string | null }) {
  const map: Record<string, string> = {
    ACTIVE: 'bg-emerald-500/15 text-emerald-300',
    COMPLETED: 'bg-sky-500/15 text-sky-300',
    WITHDRAWN: 'bg-red-500/15 text-red-300',
  }
  if (!status) return null
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs ${map[status] ?? 'bg-white/8 text-white/50'}`}>
      {formatStatusLabel(status)}
    </span>
  )
}
