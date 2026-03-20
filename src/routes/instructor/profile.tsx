import { createFileRoute } from '@tanstack/react-router'
import { LucideMail, LucideUser } from 'lucide-react'
import { LuBell, LuBookOpenCheck, LuClipboardCheck, LuUser } from 'react-icons/lu'

import PageHeader from '#/components/PageHeader'
import AvatarCard from '#/components/profile/AvatarCard'
import ContactCard from '#/components/profile/ContactCard'
import CohortCard from '#/components/profile/CohortCard'
import ProgressCard from '#/components/profile/ProgressCard'
import SkillCard from '#/components/profile/SkillCard'
import { useInstructorWorkspaceData } from '#/hooks/instructor/useInstructorWorkspaceData'
import { getFullName, getInitials } from '#/lib/consultrix-format'
import { deriveInstructorCohorts } from '#/lib/instructor-workspace'

export const Route = createFileRoute('/instructor/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  const {
    meQuery,
    studentsQuery,
    modulesQuery,
    assignmentsQuery,
    submissionsQuery,
    attendanceQuery,
    notificationsQuery,
    gradesQuery,
    isLoading,
    error,
  } = useInstructorWorkspaceData()

  if (isLoading) {
    return (
      <PageHeader
        eyebrow="Profile"
        title="Loading profile"
        subtitle="Fetching instructor account data."
      />
    )
  }

  if (error) {
    return (
      <PageHeader
        eyebrow="Profile"
        title="Profile unavailable"
        subtitle={error.message}
      />
    )
  }

  const me = meQuery.data
  const cohorts = deriveInstructorCohorts({
    students: studentsQuery.data ?? [],
    modules: modulesQuery.data ?? [],
    assignments: assignmentsQuery.data ?? [],
    attendance: attendanceQuery.data ?? [],
  })
  const fullName = getFullName(me?.firstName, me?.lastName) || 'Instructor'

  return (
    <div className="flex flex-col gap-6 w-full">
      <PageHeader
        eyebrow="Profile"
        title={fullName}
        subtitle="Live instructor account and teaching metrics"
      />

      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1 space-y-4">
          <AvatarCard
            name={fullName}
            subtitle={`Instructor ID: ${me?.id ?? '--'}`}
            buttonLabel="Account synced"
            avatarLabel={getInitials(me?.firstName, me?.lastName)}
          />
          <SkillCard
            skills={[
              'Instructor',
              `${cohorts.length} cohorts`,
              `${assignmentsQuery.data?.length ?? 0} assignments`,
              `${gradesQuery.data?.length ?? 0} grades`,
              `${submissionsQuery.data?.length ?? 0} submissions`,
            ]}
          />
        </div>
        <div className="col-span-3 space-y-4">
          <ContactCard
            items={[
              { icon: LucideMail, label: 'Email', value: me?.email ?? '--' },
              { icon: LucideUser, label: 'Role', value: 'Instructor' },
              { icon: LucideUser, label: 'User ID', value: String(me?.id ?? '--') },
            ]}
          />
          <CohortCard
            title="Teaching Summary"
            items={[
              {
                title: 'Cohorts',
                subtitle: String(cohorts.length),
              },
              {
                title: 'Students',
                subtitle: String(studentsQuery.data?.length ?? 0),
              },
              {
                title: 'Modules',
                subtitle: String(modulesQuery.data?.length ?? 0),
              },
            ]}
          />
          <ProgressCard
            title="Live Metrics"
            items={[
              {
                title: 'Assignments',
                value: String(assignmentsQuery.data?.length ?? 0),
                color: '#7C86FF',
                icon: LuBookOpenCheck,
              },
              {
                title: 'Submissions',
                value: String(submissionsQuery.data?.length ?? 0),
                color: '#C179FE',
                icon: LuClipboardCheck,
              },
              {
                title: 'Grades',
                value: String(gradesQuery.data?.length ?? 0),
                color: '#00D3F3',
                icon: LuUser,
              },
              {
                title: 'Unread',
                value: String(
                  (notificationsQuery.data ?? []).filter((item) => !item.isRead)
                    .length,
                ),
                color: '#05DB70',
                icon: LuBell,
              },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
