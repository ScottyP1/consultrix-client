import PageHeader from '#/components/PageHeader'
import SyllabusList from '#/components/syllabus/student/SyllabusList'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/student/syllabus')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Syllabus"
        subtitle="Track your progress through each module"
      />
      <SyllabusList />
    </div>
  )
}
