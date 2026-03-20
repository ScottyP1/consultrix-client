import type {
  AssignmentEntity,
  AttendanceEntity,
  CohortEntity,
  ModuleEntity,
  StudentEntity,
  SubmissionEntity,
} from '@/api/consultrix'

import {
  formatAssignmentDueDate,
  formatDate,
  formatStatusLabel,
  getFullName,
  toNumber,
} from '@/lib/consultrix-format'

export type DerivedInstructorCohort = {
  id: number
  name: string
  term: string
  status: string
  capacity: number
  startDate: string | null
  endDate: string | null
}

export function deriveInstructorCohorts({
  assignments,
  attendance,
  modules,
  students,
}: {
  assignments: AssignmentEntity[]
  attendance: AttendanceEntity[]
  modules: ModuleEntity[]
  students: StudentEntity[]
}) {
  const cohorts = new Map<number, CohortEntity>()

  students.forEach((student) => {
    if (student.cohort) {
      cohorts.set(student.cohort.id, student.cohort)
    }
  })

  modules.forEach((module) => {
    if (module.cohort) {
      cohorts.set(module.cohort.id, module.cohort)
    }
  })

  assignments.forEach((assignment) => {
    if (assignment.module.cohort) {
      cohorts.set(assignment.module.cohort.id, assignment.module.cohort)
    }
  })

  attendance.forEach((record) => {
    cohorts.set(record.cohort.id, record.cohort)
  })

  return Array.from(cohorts.values())
    .map((cohort) => ({
      id: cohort.id,
      name: cohort.name,
      term: `${formatDate(cohort.startDate)} - ${formatDate(cohort.endDate)}`,
      status: cohort.status,
      capacity: cohort.capacity,
      startDate: cohort.startDate,
      endDate: cohort.endDate,
    }))
    .sort((left, right) => left.name.localeCompare(right.name))
}

export function getStudentName(student: StudentEntity) {
  return getFullName(student.firstName, student.lastName) || student.email
}

export function getSubmissionStatus(submission?: SubmissionEntity | null) {
  if (!submission) {
    return 'missing'
  }

  return submission.status.toLowerCase() === 'submitted' ? 'submitted' : 'missing'
}

export function getAssignmentSummary(assignment: AssignmentEntity) {
  return {
    cohortName: assignment.module.cohort?.name ?? `Cohort ${assignment.module.cohort?.id ?? '--'}`,
    dueLabel: formatAssignmentDueDate(assignment.dueDate, assignment.dueTime),
    moduleTitle: assignment.module.title,
    maxScore: toNumber(assignment.maxScore),
  }
}

export function getCohortStatusLabel(status?: string | null) {
  return formatStatusLabel(status)
}
