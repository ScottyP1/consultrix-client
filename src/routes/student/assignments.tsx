import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import AssignmentsList from '#/components/assignments/AssignmentsList'
import FilterBar from '#/components/assignments/FilterBar'
import PageHeader from '#/components/PageHeader'
import {
  studentAssignmentFilters,
} from '#/data/assignments/student'
import type { StudentAssignmentItem } from '#/data/assignments/types'
import { useStudentAssignments } from '#/hooks/student/useStudentAssignments'
import { formatAssignmentDueDate } from '#/lib/consultrix-format'

export const Route = createFileRoute('/student/assignments')({
  component: RouteComponent,
})

function RouteComponent() {
  const assignmentsQuery = useStudentAssignments()
  const [selectedFilter, setSelectedFilter] = useState<string>(
    studentAssignmentFilters[0] ?? 'All',
  )

  if (assignmentsQuery.isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="Assignments"
          title="Loading assignments"
          subtitle="Fetching your coursework and submission status."
        />
      </div>
    )
  }

  if (assignmentsQuery.error) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="Assignments"
          title="Assignments unavailable"
          subtitle={assignmentsQuery.error.message}
        />
      </div>
    )
  }

  const items: StudentAssignmentItem[] = useMemo(
    () =>
      (assignmentsQuery.data ?? [])
        .map((assignment) => ({
          title: assignment.title,
          subtitle: assignment.description || assignment.moduleTitle,
          dueDate: formatAssignmentDueDate(
            assignment.dueDate,
            assignment.dueTime,
          ),
          status: getAssignmentStatus(assignment.courseworkStatus),
        }))
        .filter((assignment) =>
          matchesFilter(assignment.status, selectedFilter),
        ),
    [assignmentsQuery.data, selectedFilter],
  )

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Assignments"
        title="Assignments"
        subtitle="Manage and track all your coursework"
      />
      <FilterBar
        options={studentAssignmentFilters}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />
      {items.length > 0 ? (
        <AssignmentsList items={items} />
      ) : (
        <p className="text-sm text-white/45">
          No assignments match the selected filter.
        </p>
      )}
    </div>
  )
}

function getAssignmentStatus(status: string): StudentAssignmentItem['status'] {
  if (status === 'GRADED') {
    return 'graded'
  }

  if (status === 'SUBMITTED') {
    return 'submitted'
  }

  if (status === 'LATE') {
    return 'late'
  }

  return 'pending'
}

function matchesFilter(
  status: StudentAssignmentItem['status'],
  selectedFilter: string,
) {
  if (selectedFilter === 'All') {
    return true
  }

  return status === selectedFilter.toLowerCase()
}
