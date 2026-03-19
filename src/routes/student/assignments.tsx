import AssignmentsList from '#/components/assignments/AssignmentsList'
import FilterBar from '#/components/assignments/FilterBar'
import PageHeader from '#/components/PageHeader'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/student/assignments')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Assignments"
        subtitle="Manage and track all your coursework"
      />
      <FilterBar />
      <AssignmentsList />
    </div>
  )
}
