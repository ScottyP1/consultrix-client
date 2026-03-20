import { createFileRoute } from '@tanstack/react-router'
import { LucideCalendar, LucideMail, LucideUser } from 'lucide-react'
import { LuAward, LuBell, LuClipboardCheck, LuUser } from 'react-icons/lu'

import PageHeader from '#/components/PageHeader'
import AvatarCard from '#/components/profile/AvatarCard'
import ContactCard from '#/components/profile/ContactCard'
import CohortCard from '#/components/profile/CohortCard'
import ProgressCard from '#/components/profile/ProgressCard'
import SkillCard from '#/components/profile/SkillCard'
import { useStudentAssignments } from '#/hooks/student/useStudentAssignments'
import { useStudentAttendance } from '#/hooks/student/useStudentAttendance'
import { useStudentGrades } from '#/hooks/student/useStudentGrades'
import { useUnreadNotifications } from '#/hooks/student/useStudentNotifications'
import { useStudentProfile } from '#/hooks/student/useStudentProfile'

export const Route = createFileRoute('/student/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  const profileQuery = useStudentProfile()
  const attendanceQuery = useStudentAttendance()
  const gradesQuery = useStudentGrades()
  const assignmentsQuery = useStudentAssignments()
  const unreadNotificationsQuery = useUnreadNotifications(profileQuery.data?.userId)

  if (
    profileQuery.isLoading ||
    attendanceQuery.isLoading ||
    gradesQuery.isLoading ||
    assignmentsQuery.isLoading ||
    unreadNotificationsQuery.isLoading
  ) {
    return (
      <div className="flex flex-col gap-6 w-full">
        <PageHeader
          eyebrow="My Profile"
          title="Loading profile"
          subtitle="Fetching your student information."
        />
      </div>
    )
  }

  const error =
    profileQuery.error ??
    attendanceQuery.error ??
    gradesQuery.error ??
    assignmentsQuery.error ??
    unreadNotificationsQuery.error

  if (error) {
    return (
      <div className="flex flex-col gap-6 w-full">
        <PageHeader
          eyebrow="My Profile"
          title="Profile unavailable"
          subtitle={
            error instanceof Error
              ? error.message
              : 'Unable to load profile data right now.'
          }
        />
      </div>
    )
  }

  const profile = profileQuery.data
  const grades = gradesQuery.data ?? []
  const assignments = assignmentsQuery.data ?? []
  const unreadNotifications = unreadNotificationsQuery.data ?? []
  const fullName = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ')
  const latestGrade = grades[0]

  return (
    <div className="flex flex-col gap-6 w-full">
      <PageHeader
        eyebrow="My Profile"
        title={fullName || 'Student Profile'}
        subtitle="Manage your personal information and progress"
      />

      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1 space-y-4">
          <AvatarCard
            name={fullName || 'Student'}
            subtitle={`Student ID: ${profile?.userId ?? '--'}`}
            buttonLabel="Profile synced"
            avatarLabel={getAvatarLabel(profile?.firstName, profile?.lastName)}
          />
          <SkillCard
            skills={[
              profile?.role ?? 'Student',
              `Cohort ${profile?.cohortId ?? '--'}`,
              'Assignments',
              'Grades',
              'Attendance',
            ]}
          />
        </div>
        <div className="col-span-3 space-y-4">
          <ContactCard
            items={[
              { icon: LucideMail, label: 'Email', value: profile?.email ?? '--' },
              {
                icon: LucideUser,
                label: 'Role',
                value: profile?.role ?? '--',
              },
              {
                icon: LucideCalendar,
                label: 'Attendance',
                value:
                  attendanceQuery.data?.attendanceRate != null
                    ? `${attendanceQuery.data.attendanceRate}%`
                    : '--',
              },
              {
                icon: LucideUser,
                label: 'User ID',
                value: String(profile?.userId ?? '--'),
              },
            ]}
          />
          <CohortCard
            title="Cohort Information"
            items={[
              {
                title: 'Cohort ID',
                subtitle: String(profile?.cohortId ?? '--'),
              },
              {
                title: 'Role',
                subtitle: profile?.role ?? '--',
              },
              {
                title: 'Assignments',
                subtitle: String(assignments.length),
              },
            ]}
          />
          <ProgressCard
            title="Progress Summary"
            items={[
              {
                title: 'Grade',
                value:
                  latestGrade?.overallGradePercentage != null
                    ? `${latestGrade.overallGradePercentage}%`
                    : '--',
                color: '#7A6CFF',
                icon: LuAward,
              },
              {
                title: 'Attendance',
                value:
                  attendanceQuery.data?.attendanceRate != null
                    ? `${attendanceQuery.data.attendanceRate}%`
                    : '--',
                color: '#AD6BFF',
                icon: LuUser,
              },
              {
                title: 'Completed',
                value: String(grades.length),
                color: '#19C9FF',
                icon: LuClipboardCheck,
              },
              {
                title: 'Unread',
                value: String(unreadNotifications.length),
                color: '#16E081',
                icon: LuBell,
              },
            ]}
          />
        </div>
      </div>
    </div>
  )
}

function getAvatarLabel(firstName?: string, lastName?: string) {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}` || 'S'
}
