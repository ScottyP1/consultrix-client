import { useEffect, useMemo, useState } from 'react'

import { createFileRoute } from '@tanstack/react-router'

import PageHeader from '#/components/PageHeader'
import SectionFrame from '#/components/dashboard/SectionFrame'
import GradebookDetailPanel from '#/components/gradebook/GradebookDetailPanel'
import GradebookTable from '#/components/gradebook/GradebookTable'
import GradebookToolbar from '#/components/gradebook/GradebookToolbar'
import type {
  GradebookCohort,
  GradebookRecord,
  GradebookStatus,
} from '#/data/gradebook/types'
import { useInstructorWorkspaceData } from '#/hooks/instructor/useInstructorWorkspaceData'
import { formatAssignmentDueDate, toNumber } from '#/lib/consultrix-format'
import { deriveInstructorCohorts, getStudentName } from '#/lib/instructor-workspace'

export const Route = createFileRoute('/instructor/gradebook')({
  component: RouteComponent,
})

function RouteComponent() {
  const {
    studentsQuery,
    modulesQuery,
    assignmentsQuery,
    submissionsQuery,
    attendanceQuery,
    gradesQuery,
    isLoading,
    error,
  } = useInstructorWorkspaceData()
  const [selectedCohortId, setSelectedCohortId] = useState('')
  const [selectedModuleId, setSelectedModuleId] = useState('all')
  const [statusFilter, setStatusFilter] = useState<'all' | GradebookStatus>(
    'all',
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCell, setSelectedCell] = useState<{
    studentId: string
    assignmentId: string
  } | null>(null)
  const [localRecordOverrides, setLocalRecordOverrides] = useState<
    Record<string, GradebookRecord>
  >({})

  const cohorts = useMemo<GradebookCohort[]>(() => {
    const students = studentsQuery.data ?? []
    const modules = modulesQuery.data ?? []
    const assignments = assignmentsQuery.data ?? []
    const submissions = submissionsQuery.data ?? []
    const attendance = attendanceQuery.data ?? []
    const grades = gradesQuery.data ?? []
    const derivedCohorts = deriveInstructorCohorts({
      students,
      modules,
      assignments,
      attendance,
    })

    return derivedCohorts.map((cohort) => {
      const cohortStudents = students
        .filter((student) => student.cohort?.id === cohort.id)
        .map((student) => ({
          id: String(student.id),
          name: getStudentName(student),
          email: student.email,
        }))
      const cohortModules = modules
        .filter((module) => module.cohort?.id === cohort.id)
        .map((module) => ({
          id: String(module.id),
          title: module.title,
          order: module.orderIndex,
        }))
      const cohortAssignments = assignments
        .filter((assignment) => assignment.module.cohort?.id === cohort.id)
        .map((assignment, index) => ({
          id: String(assignment.id),
          moduleId: String(assignment.module.id),
          title: assignment.title,
          pointsPossible: toNumber(assignment.maxScore),
          dueDate: formatAssignmentDueDate(assignment.dueDate, assignment.dueTime),
          order: index,
        }))
      const cohortRecords = submissions
        .filter((submission) => submission.assignment.module.cohort?.id === cohort.id)
        .map((submission) => {
          const grade = grades.find((item) => item.submission.id === submission.id)

          return {
            studentId: String(submission.student.id),
            assignmentId: String(submission.assignment.id),
            score: grade ? toNumber(grade.score) : null,
            status: grade ? 'graded' : 'submitted',
            feedback: grade?.feedback ?? '',
            updatedAt: grade?.gradedAt ?? submission.submittedAt ?? undefined,
          } satisfies GradebookRecord
        })

      return {
        id: String(cohort.id),
        name: cohort.name,
        term: cohort.term,
        students: cohortStudents,
        modules: cohortModules,
        assignments: cohortAssignments,
        records: cohortRecords,
      }
    })
  }, [
    assignmentsQuery.data,
    attendanceQuery.data,
    gradesQuery.data,
    modulesQuery.data,
    studentsQuery.data,
    submissionsQuery.data,
  ])

  useEffect(() => {
    if (!selectedCohortId && cohorts[0]?.id) {
      setSelectedCohortId(cohorts[0].id)
    }
  }, [cohorts, selectedCohortId])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="Gradebook"
          title="Loading gradebook"
          subtitle="Fetching live grading data."
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="Gradebook"
          title="Gradebook unavailable"
          subtitle={error.message}
        />
      </div>
    )
  }

  const selectedCohort =
    cohorts.find((cohort) => cohort.id === selectedCohortId) ?? cohorts[0]

  if (!selectedCohort) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="Gradebook"
          title="No cohorts available"
          subtitle="No live gradebook cohorts were returned for this instructor."
        />
      </div>
    )
  }

  const visibleAssignments = selectedCohort.assignments.filter(
    (assignment) =>
      selectedModuleId === 'all' || assignment.moduleId === selectedModuleId,
  )
  const visibleAssignmentIds = new Set(
    visibleAssignments.map((assignment) => assignment.id),
  )
  const mergedRecords = mergeGradebookRecords(
    selectedCohort.records.filter((record) =>
      visibleAssignmentIds.has(record.assignmentId),
    ),
    localRecordOverrides,
  )
  const filteredStudents = selectedCohort.students.filter((student) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) {
      return false
    }

    if (statusFilter === 'all') {
      return true
    }

    return mergedRecords.some(
      (record) =>
        record.studentId === student.id &&
        visibleAssignmentIds.has(record.assignmentId) &&
        record.status === statusFilter,
    )
  })

  const selectedStudent = selectedCell
    ? selectedCohort.students.find((student) => student.id === selectedCell.studentId)
    : undefined
  const selectedAssignment = selectedCell
    ? selectedCohort.assignments.find(
        (assignment) => assignment.id === selectedCell.assignmentId,
      )
    : undefined
  const selectedRecord = selectedCell
    ? (mergedRecords.find(
        (record) =>
          record.studentId === selectedCell.studentId &&
          record.assignmentId === selectedCell.assignmentId,
      ) ?? {
        studentId: selectedCell.studentId,
        assignmentId: selectedCell.assignmentId,
        score: null,
        status: 'missing' as const,
        feedback: '',
      })
    : undefined

  const updateLocalRecord = (
    studentId: string,
    assignmentId: string,
    updater: (record: GradebookRecord) => GradebookRecord,
  ) => {
    setLocalRecordOverrides((current) => {
      const currentRecord =
        current[`${studentId}:${assignmentId}`] ??
        mergedRecords.find(
          (record) =>
            record.studentId === studentId &&
            record.assignmentId === assignmentId,
        ) ?? {
          studentId,
          assignmentId,
          score: null,
          status: 'missing' as const,
          feedback: '',
        }

      return {
        ...current,
        [`${studentId}:${assignmentId}`]: updater(currentRecord),
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Gradebook"
        title="Instructor Gradebook"
        subtitle="Live submission and grade data with local review controls."
      />

      <GradebookToolbar
        cohortOptions={cohorts.map((cohort) => ({
          id: cohort.id,
          name: cohort.name,
          term: cohort.term,
        }))}
        selectedCohortId={selectedCohort.id}
        onCohortChange={(value) => {
          setSelectedCohortId(value)
          setSelectedModuleId('all')
          setSelectedCell(null)
        }}
        modules={selectedCohort.modules}
        selectedModuleId={selectedModuleId}
        onModuleChange={setSelectedModuleId}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <SectionFrame
          label={`${selectedCohort.name} Grade Matrix`}
          className="min-h-[36rem]"
        >
          <GradebookTable
            modules={selectedCohort.modules}
            assignments={visibleAssignments}
            students={filteredStudents}
            records={mergedRecords}
            selectedCell={selectedCell}
            onSelectCell={(studentId, assignmentId) =>
              setSelectedCell({ studentId, assignmentId })
            }
          />
        </SectionFrame>

        <GradebookDetailPanel
          student={selectedStudent}
          assignment={selectedAssignment}
          record={selectedRecord}
          onStatusChange={(status) => {
            if (!selectedCell) {
              return
            }

            updateLocalRecord(
              selectedCell.studentId,
              selectedCell.assignmentId,
              (record) => ({
                ...record,
                status,
                score: status === 'graded' ? record.score : null,
              }),
            )
          }}
          onScoreChange={(score) => {
            if (!selectedCell) {
              return
            }

            updateLocalRecord(
              selectedCell.studentId,
              selectedCell.assignmentId,
              (record) => ({
                ...record,
                score,
                status: score !== null ? 'graded' : record.status,
              }),
            )
          }}
          onFeedbackChange={(feedback) => {
            if (!selectedCell) {
              return
            }

            updateLocalRecord(
              selectedCell.studentId,
              selectedCell.assignmentId,
              (record) => ({
                ...record,
                feedback,
              }),
            )
          }}
        />
      </div>

      <p className="text-xs text-white/35">
        Grade data is loaded live from submissions and grades. Edits in this view remain local until write actions are wired.
      </p>
    </div>
  )
}

function mergeGradebookRecords(
  records: GradebookRecord[],
  overrides: Record<string, GradebookRecord>,
) {
  const merged = new Map(
    records.map((record) => [`${record.studentId}:${record.assignmentId}`, record]),
  )

  Object.entries(overrides).forEach(([key, record]) => {
    merged.set(key, record)
  })

  return Array.from(merged.values())
}
