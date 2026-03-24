import { createFileRoute, Link } from '@tanstack/react-router'
import { LuBuilding2, LuCheck, LuClock, LuCircleX } from 'react-icons/lu'

import PageHeader from '#/components/PageHeader'
import GlassContainer from '#/components/liquidGlass/GlassContainer'
import ItemContainer from '#/components/ItemContainer'
import StatCard from '#/components/StatCard'
import { useAdminData } from '#/hooks/admin/useAdminData'
import { formatDate, formatStatusLabel } from '#/lib/consultrix-format'

export const Route = createFileRoute('/admin/facilities')({
  component: RouteComponent,
})

function RouteComponent() {
  const { facilitiesQuery, cohortsQuery, studentsQuery, isLoading, error } = useAdminData()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader eyebrow="Facilities" title="Loading facilities" subtitle="Fetching warehouse and facility data." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="Facilities"
          title="Facilities unavailable"
          subtitle={error instanceof Error ? error.message : 'Unable to load facilities.'}
        />
      </div>
    )
  }

  const facilities = facilitiesQuery.data ?? []
  const cohorts = cohortsQuery.data ?? []
  const students = studentsQuery.data ?? []

  const statCards = [
    { icon: LuBuilding2, iconBgClassName: '#0c2240', iconAccent: '#38bdf8', label: 'Total Facilities', value: String(facilities.length) },
    { icon: LuCheck, iconBgClassName: '#052e16', iconAccent: '#4ade80', label: 'Active', value: String(facilities.filter((f) => f.status === 'ACTIVE').length) },
    { icon: LuClock, iconBgClassName: '#1c1107', iconAccent: '#fb923c', label: 'Planned', value: String(facilities.filter((f) => f.status === 'PLANNED').length) },
    { icon: LuCircleX, iconBgClassName: '#1c0a0a', iconAccent: '#f87171', label: 'Closed', value: String(facilities.filter((f) => f.status === 'CLOSED').length) },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Facilities"
        title="Facilities"
        subtitle="All registered warehouses and training facilities across the platform."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <StatCard
            key={card.label}
            icon={card.icon}
            iconBgClassName={card.iconBgClassName}
            iconAccent={card.iconAccent}
            label={card.label}
            value={card.value}
          />
        ))}
      </div>

      {facilities.length > 0 ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {facilities.map((facility) => {
            const facilityCohorts = cohorts.filter((c) => c.facility?.id === facility.id)
            const facilityStudents = students.filter(
              (s) => s.cohort && facilityCohorts.some((c) => c.id === s.cohort?.id),
            )

            return (
              <Link
                key={facility.id}
                to="/admin/facility/$facilityId"
                params={{ facilityId: String(facility.id) }}
                className="block rounded-2xl hover:bg-white/5 transition-colors"
              >
                <GlassContainer className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        {facility.name ?? 'Unnamed Facility'}
                      </h2>
                      <p className="text-sm text-white/45">
                        {[facility.addressLine1, facility.city, facility.state, facility.country]
                          .filter(Boolean)
                          .join(', ') || 'No address on file'}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-white/8 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/60">
                      {formatStatusLabel(facility.status)}
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <ItemContainer className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/45">Capacity</p>
                      <p className="text-lg font-semibold text-white">{facility.capacity ?? '--'}</p>
                    </ItemContainer>
                    <ItemContainer className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/45">Cohorts</p>
                      <p className="text-lg font-semibold text-white">{facilityCohorts.length}</p>
                    </ItemContainer>
                    <ItemContainer className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/45">Students</p>
                      <p className="text-lg font-semibold text-white">{facilityStudents.length}</p>
                    </ItemContainer>
                  </div>

                  {(facility.leaseStartDate || facility.leaseEndDate) && (
                    <div className="flex items-center gap-6 border-t border-white/8 pt-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-white/45">Lease Start</p>
                        <p className="text-sm text-white">{formatDate(facility.leaseStartDate)}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-white/45">Lease End</p>
                        <p className="text-sm text-white">{formatDate(facility.leaseEndDate)}</p>
                      </div>
                    </div>
                  )}

                  {facilityCohorts.length > 0 && (
                    <div className="border-t border-white/8 pt-4">
                      <p className="mb-2 text-xs uppercase tracking-[0.18em] text-white/45">Cohorts</p>
                      <div className="flex flex-wrap gap-2">
                        {facilityCohorts.map((cohort) => (
                          <span
                            key={cohort.id}
                            className="rounded-full bg-white/8 px-3 py-1 text-xs text-white/70"
                          >
                            {cohort.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </GlassContainer>
              </Link>
            )
          })}
        </div>
      ) : (
        <p className="text-sm text-white/45">No facilities found.</p>
      )}
    </div>
  )
}
