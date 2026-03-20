import { createFileRoute } from '@tanstack/react-router'
import {
  LuAward,
  LuBookOpenCheck,
  LuChartBarIncreasing,
} from 'react-icons/lu'

import StatCard from '#/components/StatCard'
import GradesModulesList from '#/components/grades/student/GradesModulesList'
import type { GradeModule } from '#/components/grades/student/GradesModuleCard'
import PageHeader from '#/components/PageHeader'
import { useStudentAssignments } from '#/hooks/student/useStudentAssignments'
import { useStudentGrades } from '#/hooks/student/useStudentGrades'

export const Route = createFileRoute('/student/grades')({
  component: RouteComponent,
})

function RouteComponent() {
  const assignmentsQuery = useStudentAssignments()
  const gradesQuery = useStudentGrades()

  if (assignmentsQuery.isLoading || gradesQuery.isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="Grades"
          title="Loading grades"
          subtitle="Review your academic performance."
        />
      </div>
    )
  }

  const error = assignmentsQuery.error ?? gradesQuery.error

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="Grades"
          title="Grades unavailable"
          subtitle={
            error instanceof Error
              ? error.message
              : 'Unable to load grade data right now.'
          }
        />
      </div>
    )
  }

  const assignments = assignmentsQuery.data ?? []
  const grades = gradesQuery.data ?? []
  const latestGrade = grades[0]
  const averageModuleGrade =
    grades.length > 0
      ? (
          grades.reduce(
            (total, grade) => total + grade.moduleGradePercentage,
            0,
          ) / grades.length
        ).toFixed(1)
      : '--'

  const gradeStatData = [
    {
      icon: LuAward,
      iconBgClassName: 'bg-sky-500',
      label: 'Current Grade',
      value:
        latestGrade?.overallGradePercentage != null
          ? `${latestGrade.overallGradePercentage}%`
          : '--',
    },
    {
      icon: LuChartBarIncreasing,
      iconBgClassName: 'bg-violet-500',
      label: 'Current Term Average',
      value:
        typeof averageModuleGrade === 'string' && averageModuleGrade !== '--'
          ? `${averageModuleGrade}%`
          : averageModuleGrade,
    },
    {
      icon: LuBookOpenCheck,
      iconBgClassName: 'bg-sky-500',
      label: 'Assignments Graded',
      value: `${grades.length}/${assignments.length}`,
    },
  ]

  const gradesByAssignmentId = new Map(
    grades.map((grade) => [grade.assignmentId, grade]),
  )
  const modules = new Map<number, GradeModule>()

  assignments.forEach((assignment) => {
    const grade = gradesByAssignmentId.get(assignment.assignmentId)
    const existingModule = modules.get(assignment.moduleId)

    const assignmentRow = {
      id: String(assignment.assignmentId),
      title: assignment.title,
      maxScore: assignment.maxScore,
      gradePercent:
        assignment.assignmentGradePercentage ?? grade?.assignmentGradePercentage ?? null,
      status:
        assignment.courseworkStatus === 'GRADED'
          ? 'graded'
          : assignment.courseworkStatus === 'LATE'
            ? 'missing'
            : 'pending',
    } as const

    if (existingModule) {
      existingModule.assignments.push(assignmentRow)
      return
    }

    modules.set(assignment.moduleId, {
      id: String(assignment.moduleId),
      title: assignment.moduleTitle,
      courseAveragePercent: grade?.moduleGradePercentage ?? 0,
      assignments: [assignmentRow],
    })
  })

  const moduleList = Array.from(modules.values())

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Grades"
        title="Grades"
        subtitle="Review your academic performance"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {gradeStatData.map((item) => (
          <StatCard
            key={item.label}
            icon={item.icon}
            iconBgClassName={item.iconBgClassName}
            label={item.label}
            value={item.value}
          />
        ))}
      </div>

      {moduleList.length > 0 ? (
        <GradesModulesList modules={moduleList} />
      ) : (
        <p className="text-sm text-white/45">No grade records available.</p>
      )}
    </div>
  )
}
