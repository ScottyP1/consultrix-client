import { createFileRoute, Link } from '@tanstack/react-router'
import { LuArrowLeft, LuUsers, LuBuilding2, LuBookOpen } from 'react-icons/lu'

import PageHeader from '#/components/PageHeader'
import GlassContainer from '#/components/liquidGlass/GlassContainer'
import ItemContainer from '#/components/ItemContainer'
import StatCard from '#/components/StatCard'
import SectionFrame from '#/components/dashboard/SectionFrame'
import { useAdminData } from '#/hooks/admin/useAdminData'
import { formatDate, formatStatusLabel, getFullName } from '#/lib/consultrix-format'

export const Route = createFileRoute('/admin/facility/$facilityId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { facilityId } = Route.useParams()
  const id = Number(facilityId)

  const { facilitiesQuery, cohortsQuery, studentsQuery, instructorsQuery, isLoading } = useAdminData()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <BackLink />
        <PageHeader eyebrow="Facility" title="Loading facility…" />
      </div>
    )
  }

  const facility = (facilitiesQuery.data ?? []).find((f) => f.id === id)

  if (!facility) {
    return (
      <div className="flex flex-col gap-6">
        <BackLink />
        <PageHeader eyebrow="Facility" title="Facility not found" subtitle={`No facility with ID ${id}`} />
      </div>
    )
  }

  const cohorts = (cohortsQuery.data ?? []).filter((c) => c.facility?.id === id)
  const students = (studentsQuery.data ?? []).filter(
    (s) => s.cohort && cohorts.some((c) => c.id === s.cohort?.id),
  )
  const instructors = (instructorsQuery.data ?? []).filter(
    (i) => cohorts.some((c) => c.primaryInstructor?.id === i.id),
  )

  const address = [facility.addressLine1, facility.city, facility.state, facility.country]
    .filter(Boolean)
    .join(', ')

  const capacityUsed = facility.capacity
    ? Math.round((students.length / facility.capacity) * 100)
    : null

  return (
    <div className="flex flex-col gap-6">
      <BackLink />

      <div className="flex items-start justify-between gap-4">
        <PageHeader
          eyebrow="Facility"
          title={facility.name ?? 'Unnamed Facility'}
          subtitle={address || 'No address on file'}
        />
        <span className="mt-1 shrink-0 rounded-full bg-white/8 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/60">
          {formatStatusLabel(facility.status)}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={LuBuilding2} iconBgClassName="#0c2240" iconAccent="#38bdf8"
          label="Cohorts" value={String(cohorts.length)} />
        <StatCard icon={LuUsers} iconBgClassName="#052e16" iconAccent="#4ade80"
          label="Students" value={String(students.length)} />
        <StatCard icon={LuBookOpen} iconBgClassName="#1e1b4b" iconAccent="#818cf8"
          label="Instructors" value={String(instructors.length)} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {/* Facility info */}
        <GlassContainer className="space-y-4 p-5">
          <p className="text-xs uppercase tracking-[0.28em] text-white/45">Details</p>
          <div className="grid grid-cols-2 gap-3">
            <InfoItem label="Status" value={formatStatusLabel(facility.status)} />
            <InfoItem label="Capacity" value={facility.capacity != null ? String(facility.capacity) : '--'} />
            <InfoItem label="City" value={facility.city ?? '--'} />
            <InfoItem label="State" value={facility.state ?? '--'} />
            <InfoItem label="Country" value={facility.country ?? '--'} />
            <InfoItem label="Address" value={facility.addressLine1 ?? '--'} />
          </div>

          {(facility.leaseStartDate || facility.leaseEndDate) && (
            <div className="border-t border-white/8 pt-4 grid grid-cols-2 gap-3">
              <InfoItem label="Lease Start" value={formatDate(facility.leaseStartDate)} />
              <InfoItem label="Lease End" value={formatDate(facility.leaseEndDate)} />
            </div>
          )}

          {capacityUsed != null && (
            <div className="border-t border-white/8 pt-4">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">Capacity Used</p>
                <p className="text-xs text-white/45">{students.length}/{facility.capacity} · {capacityUsed}%</p>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-linear-to-r from-sky-500 to-indigo-500"
                  style={{ width: `${Math.min(capacityUsed, 100)}%` }}
                />
              </div>
            </div>
          )}
        </GlassContainer>

        {/* Instructors at this facility */}
        <SectionFrame label="Instructors">
          {instructors.length > 0 ? (
            <div className="flex flex-col gap-2">
              {instructors.map((instructor) => {
                const instructorCohorts = cohorts.filter(
                  (c) => c.primaryInstructor?.id === instructor.id,
                )
                return (
                  <Link
                    key={instructor.id}
                    to="/admin/instructor/$instructorId"
                    params={{ instructorId: String(instructor.id) }}
                    className="rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <ItemContainer className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-white">
                          {getFullName(instructor.firstName, instructor.lastName)}
                        </p>
                        <p className="text-xs text-white/35">
                          {instructor.title ?? 'Instructor'} · {instructorCohorts.length} cohort{instructorCohorts.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      {instructor.specialty && (
                        <span className="shrink-0 text-xs text-white/35">{instructor.specialty}</span>
                      )}
                    </ItemContainer>
                  </Link>
                )
              })}
            </div>
          ) : (
            <p className="py-4 text-center text-sm text-white/35">No instructors at this facility.</p>
          )}
        </SectionFrame>
      </div>

      {/* Cohort list */}
      <SectionFrame label={`Cohorts (${cohorts.length})`}>
        {cohorts.length > 0 ? (
          <div className="grid gap-3 xl:grid-cols-2">
            {cohorts.map((cohort) => {
              const cohortStudents = students.filter((s) => s.cohort?.id === cohort.id).length
              const fill = cohort.capacity > 0 ? Math.round((cohortStudents / cohort.capacity) * 100) : 0
              return (
                <Link
                  key={cohort.id}
                  to="/admin/cohort/$cohortId"
                  params={{ cohortId: String(cohort.id) }}
                  className="rounded-xl hover:bg-white/5 transition-colors"
                >
                  <ItemContainer className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">{cohort.name}</p>
                      <span className="rounded-full bg-white/8 px-2.5 py-0.5 text-xs text-white/50">
                        {formatStatusLabel(cohort.status)}
                      </span>
                    </div>
                    <p className="text-xs text-white/35">
                      {formatDate(cohort.startDate)} – {formatDate(cohort.endDate)}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-sky-500/60" style={{ width: `${Math.min(fill, 100)}%` }} />
                      </div>
                      <span className="shrink-0 text-[10px] text-white/30">{cohortStudents}/{cohort.capacity}</span>
                    </div>
                  </ItemContainer>
                </Link>
              )
            })}
          </div>
        ) : (
          <p className="py-4 text-center text-sm text-white/35">No cohorts at this facility.</p>
        )}
      </SectionFrame>
    </div>
  )
}

function BackLink() {
  return (
    <Link to="/admin/facilities" className="flex items-center gap-1.5 text-sm text-white/45 hover:text-white/70 transition-colors w-fit">
      <LuArrowLeft size={14} />
      Back to Facilities
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
