import PageHeader from '#/components/PageHeader'
import SyllabusList from '#/components/syllabus/student/SyllabusList'
import { createFileRoute } from '@tanstack/react-router'
import { useStudentAssignments } from '#/hooks/student/useStudentAssignments'
import { useStudentGrades } from '#/hooks/student/useStudentGrades'

export const Route = createFileRoute('/student/syllabus')({
  component: RouteComponent,
})

function RouteComponent() {
  const assignmentsQuery = useStudentAssignments()
  const gradesQuery = useStudentGrades()

  if (assignmentsQuery.isLoading || gradesQuery.isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="Syllabus"
          title="Loading syllabus"
          subtitle="Fetching your modules and assignment progress."
        />
      </div>
    )
  }

  const error = assignmentsQuery.error ?? gradesQuery.error

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="Syllabus"
          title="Syllabus unavailable"
          subtitle={error.message}
        />
      </div>
    )
  }

  const gradesByAssignmentId = new Set(
    (gradesQuery.data ?? []).map((grade) => grade.assignmentId),
  )
  const modules = Array.from(
    (assignmentsQuery.data ?? [])
      .reduce((accumulator, assignment) => {
        const current = accumulator.get(assignment.moduleId) ?? {
          module: assignment.moduleTitle,
          moduleId: assignment.moduleId,
          assignments: [] as { status: 'complete' | 'incomplete'; title: string }[],
        }

        current.assignments.push({
          title: assignment.title,
          status: gradesByAssignmentId.has(assignment.assignmentId)
            ? 'complete'
            : 'incomplete',
        })
        accumulator.set(assignment.moduleId, current)

        return accumulator
      }, new Map<number, {
        module: string
        moduleId: number
        assignments: { status: 'complete' | 'incomplete'; title: string }[]
      }>())
      .values(),
  )
    .sort((left, right) => left.moduleId - right.moduleId)
    .map((module) => {
      const completedCount = module.assignments.filter(
        (assignment) => assignment.status === 'complete',
      ).length
      const completionPercentage =
        module.assignments.length > 0
          ? Math.round((completedCount / module.assignments.length) * 100)
          : 0

      return {
        module: module.module,
        completionPercentage: `${completionPercentage}%`,
        moduleDuration: `${module.assignments.length} assignments`,
        assignments: module.assignments,
      }
    })

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Syllabus"
        title="Syllabus"
        subtitle="Track your progress through each module"
      />
      {modules.length > 0 ? (
        <SyllabusList items={modules} />
      ) : (
        <p className="text-sm text-white/45">No syllabus data available.</p>
      )}
    </div>
  )
}
