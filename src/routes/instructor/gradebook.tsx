import { useState } from 'react'

import { createFileRoute } from '@tanstack/react-router'

import PageHeader from '#/components/PageHeader'
import SectionFrame from '#/components/dashboard/SectionFrame'
import GradebookDetailPanel from '#/components/gradebook/GradebookDetailPanel'
import GradebookTable from '#/components/gradebook/GradebookTable'
import GradebookToolbar from '#/components/gradebook/GradebookToolbar'

import { instructorGradebookCohorts } from '#/data/gradebook/instructor'
import type { GradebookStatus } from '#/data/gradebook/types'

export const Route = createFileRoute('/instructor/gradebook')({
  component: RouteComponent,
})

function RouteComponent() {
  const [cohorts, setCohorts] = useState(instructorGradebookCohorts)
  const [selectedCohortId, setSelectedCohortId] = useState(
    instructorGradebookCohorts[0]?.id ?? '',
  )
  const [selectedModuleId, setSelectedModuleId] = useState('all')
  const [statusFilter, setStatusFilter] = useState<'all' | GradebookStatus>(
    'all',
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCell, setSelectedCell] = useState<{
    studentId: string
    assignmentId: string
  } | null>(null)

  const selectedCohort =
    cohorts.find((cohort) => cohort.id === selectedCohortId) ?? cohorts[0]

  if (!selectedCohort) {
    return null
  }

  const visibleAssignments = selectedCohort.assignments.filter(
    (assignment) =>
      selectedModuleId === 'all' || assignment.moduleId === selectedModuleId,
  )

  const visibleAssignmentIds = new Set(
    visibleAssignments.map((assignment) => assignment.id),
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

    return selectedCohort.records.some(
      (record) =>
        record.studentId === student.id &&
        visibleAssignmentIds.has(record.assignmentId) &&
        record.status === statusFilter,
    )
  })

  const selectedStudent = selectedCell
    ? selectedCohort.students.find(
        (student) => student.id === selectedCell.studentId,
      )
    : undefined
  const selectedAssignment = selectedCell
    ? selectedCohort.assignments.find(
        (assignment) => assignment.id === selectedCell.assignmentId,
      )
    : undefined
  const selectedRecord = selectedCell
    ? (selectedCohort.records.find(
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

  const updateSelectedRecord = (
    updater: (record: {
      studentId: string
      assignmentId: string
      score: number | null
      status: GradebookStatus
      feedback?: string
    }) => {
      studentId: string
      assignmentId: string
      score: number | null
      status: GradebookStatus
      feedback?: string
    },
  ) => {
    if (!selectedCell) {
      return
    }

    setCohorts((currentCohorts) =>
      currentCohorts.map((cohort) => {
        if (cohort.id !== selectedCohort.id) {
          return cohort
        }

        const existingRecord = cohort.records.find(
          (record) =>
            record.studentId === selectedCell.studentId &&
            record.assignmentId === selectedCell.assignmentId,
        ) ?? {
          studentId: selectedCell.studentId,
          assignmentId: selectedCell.assignmentId,
          score: null,
          status: 'missing' as const,
          feedback: '',
        }

        const nextRecord = updater(existingRecord)
        const hasExistingRecord = cohort.records.some(
          (record) =>
            record.studentId === selectedCell.studentId &&
            record.assignmentId === selectedCell.assignmentId,
        )

        return {
          ...cohort,
          records: hasExistingRecord
            ? cohort.records.map((record) =>
                record.studentId === selectedCell.studentId &&
                record.assignmentId === selectedCell.assignmentId
                  ? nextRecord
                  : record,
              )
            : [...cohort.records, nextRecord],
        }
      }),
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Gradebook"
        title="Instructor Gradebook"
        subtitle="Scan every assignment by module, filter for risk, and update a student grade from a single view."
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
            records={selectedCohort.records.filter((record) =>
              visibleAssignmentIds.has(record.assignmentId),
            )}
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
          onStatusChange={(status) =>
            updateSelectedRecord((record) => ({
              ...record,
              status,
              score: status === 'graded' ? record.score : null,
            }))
          }
          onScoreChange={(score) =>
            updateSelectedRecord((record) => ({
              ...record,
              score,
              status: score !== null ? 'graded' : record.status,
            }))
          }
          onFeedbackChange={(feedback) =>
            updateSelectedRecord((record) => ({
              ...record,
              feedback,
            }))
          }
        />
      </div>
    </div>
  )
}
