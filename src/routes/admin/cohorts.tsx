import { createFileRoute, Link } from '@tanstack/react-router'
import { LuUsers } from 'react-icons/lu'

import PageHeader from '#/components/PageHeader'
import GlassContainer from '#/components/liquidGlass/GlassContainer'
import ItemContainer from '#/components/ItemContainer'
import StatCard from '#/components/StatCard'
import { useAdminData } from '#/hooks/admin/useAdminData'
import { formatDate, formatStatusLabel, getFullName } from '#/lib/consultrix-format'

export const Route = createFileRoute('/admin/cohorts')({
  component: RouteComponent,
})

function RouteComponent() {
  const {
    cohortsQuery,
    studentsQuery,
    modulesQuery,
    assignmentsQuery,
    isLoading,
    error,
  } = useAdminData()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader eyebrow="Cohorts" title="Loading cohorts" subtitle="Fetching cohort data." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="Cohorts"
          title="Cohorts unavailable"
          subtitle={error instanceof Error ? error.message : 'Unable to load cohorts.'}
        />
      </div>
    )
  }

  const cohorts = cohortsQuery.data ?? []
  const students = studentsQuery.data ?? []
  const modules = modulesQuery.data ?? []
  const assignments = assignmentsQuery.data ?? []

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Cohorts"
        title="Cohorts"
        subtitle="All cohorts across every facility — lifecycle, capacity, and roster details."
      />

      <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-5">
        {[
          { icon: LuUsers, iconBgClassName: '#0c2240', iconAccent: '#38bdf8', label: 'Total', value: String(cohorts.length) },
          { icon: LuUsers, iconBgClassName: '#052e16', iconAccent: '#4ade80', label: 'Active', value: String(cohorts.filter((c) => c.status === 'ACTIVE').length) },
          { icon: LuUsers, iconBgClassName: '#1e1b4b', iconAccent: '#818cf8', label: 'Recruiting', value: String(cohorts.filter((c) => c.status === 'RECRUITING').length) },
          { icon: LuUsers, iconBgClassName: '#1c1107', iconAccent: '#fb923c', label: 'Interviewing', value: String(cohorts.filter((c) => c.status === 'INTERVIEWING').length) },
          { icon: LuUsers, iconBgClassName: '#1c0a0a', iconAccent: '#f87171', label: 'Completed', value: String(cohorts.filter((c) => c.status === 'COMPLETED').length) },
        ].map((card) => (
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

      {cohorts.length > 0 ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {cohorts.map((cohort) => {
            const cohortStudents = students.filter((s) => s.cohort?.id === cohort.id)
            const cohortModules = modules.filter((m) => m.cohort?.id === cohort.id)
            const cohortAssignments = assignments.filter((a) => a.module.cohort?.id === cohort.id)
            const instructorName = cohort.primaryInstructor
              ? getFullName(cohort.primaryInstructor.firstName, cohort.primaryInstructor.lastName)
              : null

            return (
              <Link
                key={cohort.id}
                to="/admin/cohort/$cohortId"
                params={{ cohortId: String(cohort.id) }}
                className="block rounded-2xl hover:bg-white/5 transition-colors"
              >
                <GlassContainer className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-white">{cohort.name}</h2>
                      <p className="text-sm text-white/45">
                        {cohort.facility?.name ?? 'No facility'}
                        {instructorName ? ` · ${instructorName}` : ''}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-white/8 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/60">
                      {formatStatusLabel(cohort.status)}
                    </span>
                  </div>

                  <div className="grid gap-3 grid-cols-3">
                    <ItemContainer className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/45">Students</p>
                      <p className="text-lg font-semibold text-white">{cohortStudents.length}</p>
                      <p className="text-xs text-white/30">of {cohort.capacity} cap</p>
                    </ItemContainer>
                    <ItemContainer className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/45">Modules</p>
                      <p className="text-lg font-semibold text-white">{cohortModules.length}</p>
                    </ItemContainer>
                    <ItemContainer className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/45">Assignments</p>
                      <p className="text-lg font-semibold text-white">{cohortAssignments.length}</p>
                    </ItemContainer>
                  </div>

                  <div className="flex items-center gap-6 border-t border-white/8 pt-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-white/45">Start</p>
                      <p className="text-sm text-white">{formatDate(cohort.startDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-white/45">End</p>
                      <p className="text-sm text-white">{formatDate(cohort.endDate)}</p>
                    </div>
                    {cohort.primaryInstructor && (
                      <div className="ml-auto text-right">
                        <p className="text-xs uppercase tracking-[0.18em] text-white/45">Instructor</p>
                        <p className="text-sm text-white">{instructorName}</p>
                        {cohort.primaryInstructor.title && (
                          <p className="text-xs text-white/45">{cohort.primaryInstructor.title}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {cohortModules.length > 0 && (
                    <div className="border-t border-white/8 pt-4">
                      <p className="mb-2 text-xs uppercase tracking-[0.18em] text-white/45">Modules</p>
                      <div className="flex flex-wrap gap-2">
                        {cohortModules
                          .sort((a, b) => a.orderIndex - b.orderIndex)
                          .map((mod) => (
                            <span
                              key={mod.id}
                              className="rounded-full bg-white/8 px-3 py-1 text-xs text-white/70"
                            >
                              {mod.title}
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
        <p className="text-sm text-white/45">No cohorts found.</p>
      )}
    </div>
  )
}
