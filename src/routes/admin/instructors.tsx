import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { LuUserCheck, LuUsers, LuBookOpen } from 'react-icons/lu'

import PageHeader from '#/components/PageHeader'
import GlassContainer from '#/components/liquidGlass/GlassContainer'
import ItemContainer from '#/components/ItemContainer'
import StatCard from '#/components/StatCard'
import { useAdminData } from '#/hooks/admin/useAdminData'
import { formatStatusLabel, getFullName } from '#/lib/consultrix-format'

export const Route = createFileRoute('/admin/instructors')({
  component: RouteComponent,
})

function RouteComponent() {
  const { instructorsQuery, cohortsQuery, studentsQuery, isLoading, error } = useAdminData()
  const [search, setSearch] = useState('')

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader eyebrow="Instructors" title="Loading instructors" subtitle="Fetching instructor data." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="Instructors"
          title="Instructors unavailable"
          subtitle={error instanceof Error ? error.message : 'Unable to load instructors.'}
        />
      </div>
    )
  }

  const instructors = instructorsQuery.data ?? []
  const cohorts = cohortsQuery.data ?? []
  const students = studentsQuery.data ?? []

  const activeInstructors = instructors.filter((i) => i.status === 'ACTIVE')
  const specialties = Array.from(new Set(instructors.map((i) => i.specialty).filter(Boolean)))

  const filtered = instructors.filter((i) => {
    const name = getFullName(i.firstName, i.lastName).toLowerCase()
    const email = i.email.toLowerCase()
    const term = search.toLowerCase()
    return !search || name.includes(term) || email.includes(term)
  })

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Instructors"
        title="Instructors"
        subtitle="All instructors — cohort assignments, specialties, and contact details."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: LuUserCheck, iconBgClassName: '#0c2240', iconAccent: '#38bdf8', label: 'Total Instructors', value: String(instructors.length) },
          { icon: LuUsers, iconBgClassName: '#052e16', iconAccent: '#4ade80', label: 'Active', value: String(activeInstructors.length) },
          { icon: LuBookOpen, iconBgClassName: '#1e1b4b', iconAccent: '#818cf8', label: 'Specialties', value: String(specialties.length) },
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

      <GlassContainer className="flex items-center gap-3 p-4">
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-w-[200px] flex-1 rounded-lg bg-white/8 px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:ring-1 focus:ring-white/20"
        />
        <span className="ml-auto text-xs text-white/45">
          {filtered.length} of {instructors.length} instructors
        </span>
      </GlassContainer>

      {filtered.length > 0 ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {filtered.map((instructor) => {
            const instructorCohorts = cohorts.filter((c) => c.primaryInstructor?.id === instructor.id)
            const instructorStudents = students.filter(
              (s) => s.cohort && instructorCohorts.some((c) => c.id === s.cohort?.id),
            )

            return (
              <Link
                key={instructor.id}
                to="/admin/instructor/$instructorId"
                params={{ instructorId: String(instructor.id) }}
                className="block rounded-2xl hover:bg-white/5 transition-colors"
              >
                <GlassContainer className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-semibold text-white">
                          {getFullName(instructor.firstName, instructor.lastName)}
                        </h2>
                        {instructor.status && (
                          <span className="rounded-full bg-white/8 px-2 py-0.5 text-xs uppercase tracking-[0.12em] text-white/50">
                            {formatStatusLabel(instructor.status)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-white/45">{instructor.email}</p>
                    </div>
                  </div>

                  <div className="grid gap-3 grid-cols-3">
                    <ItemContainer className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/45">Cohorts</p>
                      <p className="text-lg font-semibold text-white">{instructorCohorts.length}</p>
                    </ItemContainer>
                    <ItemContainer className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/45">Students</p>
                      <p className="text-lg font-semibold text-white">{instructorStudents.length}</p>
                    </ItemContainer>
                    <ItemContainer className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/45">Role</p>
                      <p className="text-sm font-medium text-white truncate">
                        {instructor.title ?? 'Instructor'}
                      </p>
                    </ItemContainer>
                  </div>

                  {(instructor.specialty || instructor.officeHours) && (
                    <div className="flex flex-wrap gap-4 border-t border-white/8 pt-4">
                      {instructor.specialty && (
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-white/45">Specialty</p>
                          <p className="text-sm text-white">{instructor.specialty}</p>
                        </div>
                      )}
                      {instructor.officeHours && (
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-white/45">Office Hours</p>
                          <p className="text-sm text-white">{instructor.officeHours}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {instructorCohorts.length > 0 && (
                    <div className="border-t border-white/8 pt-4">
                      <p className="mb-2 text-xs uppercase tracking-[0.18em] text-white/45">Primary Cohorts</p>
                      <div className="flex flex-wrap gap-2">
                        {instructorCohorts.map((cohort) => (
                          <span
                            key={cohort.id}
                            className="rounded-full bg-white/8 px-3 py-1 text-xs text-white/70"
                          >
                            {cohort.name}
                            {cohort.status ? (
                              <span className="ml-1 text-white/35">· {formatStatusLabel(cohort.status)}</span>
                            ) : null}
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
        <p className="text-sm text-white/45">No instructors match the current search.</p>
      )}
    </div>
  )
}
