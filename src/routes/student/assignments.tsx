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

  const grouped = useMemo(() => {
    const allItems = (assignmentsQuery.data ?? [])
      .map((assignment) => ({
        assignmentId: assignment.assignmentId,
        moduleTitle: assignment.moduleTitle || 'General',
        title: assignment.title,
        subtitle: assignment.description || assignment.moduleTitle,
        dueDate: formatAssignmentDueDate(assignment.dueDate, assignment.dueTime),
        status: getAssignmentStatus(assignment.courseworkStatus),
      }))
      .filter((item) => matchesFilter(item.status, selectedFilter))

    const map = new Map<string, StudentAssignmentItem[]>()
    for (const item of allItems) {
      const key = item.moduleTitle
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push({
        assignmentId: item.assignmentId,
        title: item.title,
        subtitle: item.subtitle,
        dueDate: item.dueDate,
        status: item.status,
      })
    }
    return map
  }, [assignmentsQuery.data, selectedFilter])

  const totalVisible = Array.from(grouped.values()).reduce(
    (sum, items) => sum + items.length,
    0,
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
      {totalVisible === 0 ? (
        <p className="text-sm text-white/45">
          No assignments match the selected filter.
        </p>
      ) : (
        <div className="flex flex-col gap-8">
          {Array.from(grouped.entries()).map(([moduleTitle, items]) => (
            <div key={moduleTitle} className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
                {moduleTitle}
              </h3>
              <AssignmentsList items={items} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function getAssignmentStatus(status: string): StudentAssignmentItem['status'] {
  if (status === 'GRADED') return 'graded'
  if (status === 'SUBMITTED') return 'submitted'
  if (status === 'LATE') return 'late'
  return 'pending'
}

function matchesFilter(
  status: StudentAssignmentItem['status'],
  selectedFilter: string,
) {
  if (selectedFilter === 'All') return true
  return status === selectedFilter.toLowerCase()
}
