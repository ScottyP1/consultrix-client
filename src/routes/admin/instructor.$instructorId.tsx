import { createFileRoute, Link } from '@tanstack/react-router'
import { LuArrowLeft, LuUsers, LuBookOpen, LuUserCheck } from 'react-icons/lu'

import PageHeader from '#/components/PageHeader'
import GlassContainer from '#/components/liquidGlass/GlassContainer'
import ItemContainer from '#/components/ItemContainer'
import StatCard from '#/components/StatCard'
import SectionFrame from '#/components/dashboard/SectionFrame'
import { useAdminData } from '#/hooks/admin/useAdminData'
import { formatDate, formatStatusLabel, getFullName } from '#/lib/consultrix-format'

export const Route = createFileRoute('/admin/instructor/$instructorId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { instructorId } = Route.useParams()
  const id = Number(instructorId)

  const { instructorsQuery, cohortsQuery, studentsQuery, modulesQuery, isLoading } = useAdminData()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <BackLink />
        <PageHeader eyebrow="Instructor" title="Loading instructor…" />
      </div>
    )
  }

  const instructor = (instructorsQuery.data ?? []).find((i) => i.id === id)

  if (!instructor) {
    return (
      <div className="flex flex-col gap-6">
        <BackLink />
        <PageHeader eyebrow="Instructor" title="Instructor not found" subtitle={`No instructor with ID ${id}`} />
      </div>
    )
  }

  const cohorts = (cohortsQuery.data ?? []).filter((c) => c.primaryInstructor?.id === id)
  const students = (studentsQuery.data ?? []).filter(
    (s) => s.cohort && cohorts.some((c) => c.id === s.cohort?.id),
  )
  const modules = (modulesQuery.data ?? []).filter(
    (m) => m.cohort && cohorts.some((c) => c.id === m.cohort?.id),
  )

  const name = getFullName(instructor.firstName, instructor.lastName)

  return (
    <div className="flex flex-col gap-6">
      <BackLink />

      <div className="flex items-start justify-between gap-4">
        <PageHeader
          eyebrow="Instructor"
          title={name}
          subtitle={instructor.email}
        />
        {instructor.status && (
          <span className="mt-1 shrink-0 rounded-full bg-white/8 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/60">
            {formatStatusLabel(instructor.status)}
          </span>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={LuUsers} iconBgClassName="#0c2240" iconAccent="#38bdf8"
          label="Cohorts" value={String(cohorts.length)} />
        <StatCard icon={LuUserCheck} iconBgClassName="#052e16" iconAccent="#4ade80"
          label="Students" value={String(students.length)} />
        <StatCard icon={LuBookOpen} iconBgClassName="#1e1b4b" iconAccent="#818cf8"
          label="Modules" value={String(modules.length)} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {/* Profile */}
        <GlassContainer className="space-y-4 p-5">
          <p className="text-xs uppercase tracking-[0.28em] text-white/45">Profile</p>
          <div className="grid grid-cols-2 gap-3">
            <InfoItem label="Title" value={instructor.title ?? '--'} />
            <InfoItem label="Specialty" value={instructor.specialty ?? '--'} />
            <InfoItem label="Office Hours" value={instructor.officeHours ?? '--'} />
            <InfoItem label="Status" value={formatStatusLabel(instructor.status)} />
          </div>
          <div className="border-t border-white/8 pt-4">
            <InfoItem label="Email" value={instructor.email} />
          </div>
        </GlassContainer>

        {/* Cohort list */}
        <SectionFrame label="Primary Cohorts">
          {cohorts.length > 0 ? (
            <div className="flex flex-col gap-2">
              {cohorts.map((cohort) => {
                const cohortStudents = students.filter((s) => s.cohort?.id === cohort.id).length
                return (
                  <Link
                    key={cohort.id}
                    to="/admin/cohort/$cohortId"
                    params={{ cohortId: String(cohort.id) }}
                    className="flex items-center justify-between gap-4 rounded-xl px-3 py-2.5 hover:bg-white/5 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">{cohort.name}</p>
                      <p className="text-xs text-white/35">
                        {cohort.facility?.name ?? 'No facility'} · {cohortStudents} students
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-white/35">
                        {formatDate(cohort.startDate)} – {formatDate(cohort.endDate)}
                      </span>
                      <span className="rounded-full bg-white/8 px-2.5 py-0.5 text-xs text-white/50">
                        {formatStatusLabel(cohort.status)}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <p className="py-4 text-center text-sm text-white/35">No cohorts assigned.</p>
          )}
        </SectionFrame>
      </div>

      {/* Student roster */}
      <SectionFrame label={`Students (${students.length})`}>
        {students.length > 0 ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {students.map((student) => (
              <Link
                key={student.id}
                to="/admin/student/$studentId"
                params={{ studentId: String(student.id) }}
                className="rounded-xl hover:bg-white/5 transition-colors"
              >
                <ItemContainer className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-white">
                      {getFullName(student.firstName, student.lastName)}
                    </p>
                    <p className="text-xs text-white/35">{student.cohort?.name ?? '--'}</p>
                  </div>
                  {student.pipelineStage && (
                    <span className="shrink-0 text-xs text-white/35">
                      {formatStatusLabel(student.pipelineStage)}
                    </span>
                  )}
                </ItemContainer>
              </Link>
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-sm text-white/35">No students found.</p>
        )}
      </SectionFrame>
    </div>
  )
}

function BackLink() {
  return (
    <Link to="/admin/instructors" className="flex items-center gap-1.5 text-sm text-white/45 hover:text-white/70 transition-colors w-fit">
      <LuArrowLeft size={14} />
      Back to Instructors
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
