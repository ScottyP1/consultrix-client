import { createFileRoute } from '@tanstack/react-router'

import ItemContainer from '#/components/ItemContainer'
import GlassContainer from '#/components/liquidGlass/GlassContainer'
import PageHeader from '#/components/PageHeader'
import { useInstructorWorkspaceData } from '#/hooks/instructor/useInstructorWorkspaceData'
import {
  formatStatusLabel,
} from '#/lib/consultrix-format'
import { deriveInstructorCohorts } from '#/lib/instructor-workspace'

export const Route = createFileRoute('/instructor/cohorts')({
  component: RouteComponent,
})

function RouteComponent() {
  const { studentsQuery, modulesQuery, assignmentsQuery, attendanceQuery, isLoading, error } =
    useInstructorWorkspaceData()

  if (isLoading) {
    return (
      <PageHeader
        eyebrow="Cohorts"
        title="Loading cohorts"
        subtitle="Fetching live cohort data."
      />
    )
  }

  if (error) {
    return (
      <PageHeader
        eyebrow="Cohorts"
        title="Cohorts unavailable"
        subtitle={error.message}
      />
    )
  }

  const students = studentsQuery.data ?? []
  const modules = modulesQuery.data ?? []
  const assignments = assignmentsQuery.data ?? []
  const attendance = attendanceQuery.data ?? []
  const cohorts = deriveInstructorCohorts({
    students,
    modules,
    assignments,
    attendance,
  }).map((cohort) => ({
    ...cohort,
    studentCount: students.filter((student) => student.cohort?.id === cohort.id)
      .length,
    moduleCount: modules.filter((module) => module.cohort?.id === cohort.id).length,
    assignmentCount: assignments.filter(
      (assignment) => assignment.module.cohort?.id === cohort.id,
    ).length,
  }))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Cohorts"
        title="Cohorts"
        subtitle="Live cohorts derived from enrolled students, modules, and assignments."
      />

      {cohorts.length > 0 ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {cohorts.map((cohort) => (
            <GlassContainer key={cohort.id} className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {cohort.name}
                  </h2>
                  <p className="text-sm text-white/45">{cohort.term}</p>
                </div>
                <span className="rounded-full bg-white/8 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/60">
                  {formatStatusLabel(cohort.status)}
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <ItemContainer className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                    Students
                  </p>
                  <p className="text-lg font-semibold text-white">
                    {cohort.studentCount}
                  </p>
                </ItemContainer>
                <ItemContainer className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                    Modules
                  </p>
                  <p className="text-lg font-semibold text-white">
                    {cohort.moduleCount}
                  </p>
                </ItemContainer>
                <ItemContainer className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                    Assignments
                  </p>
                  <p className="text-lg font-semibold text-white">
                    {cohort.assignmentCount}
                  </p>
                </ItemContainer>
              </div>
            </GlassContainer>
          ))}
        </div>
      ) : (
        <p className="text-sm text-white/45">No cohorts available.</p>
      )}
    </div>
  )
}
