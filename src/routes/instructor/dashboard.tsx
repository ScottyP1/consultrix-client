import { createFileRoute } from '@tanstack/react-router'
import {
  LuBell,
  LuBookOpenCheck,
  LuClipboardCheck,
  LuClock3,
} from 'react-icons/lu'

import PageHeader from '#/components/PageHeader'
import AnnouncementsSection from '#/components/dashboard/AnnouncementsSection'
import DashboardActionList from '#/components/dashboard/DashboardActionList'
import DashboardGrid, {
  DashboardColumn,
} from '#/components/dashboard/DashboardGrid'
import QuickActionsSection from '#/components/dashboard/QuickActionsSection'
import SectionFrame from '#/components/dashboard/SectionFrame'
import StatsSection from '#/components/dashboard/StatsSection'
import UpcomingSection from '#/components/dashboard/UpcomingSection'
import ItemContainer from '#/components/ItemContainer'
import { instructorQuickActions } from '#/data/dashboard/instructor'
import { useInstructorWorkspaceData } from '#/hooks/instructor/useInstructorWorkspaceData'
import {
  formatAssignmentDueDate,
  formatDateTime,
  getFullName,
} from '#/lib/consultrix-format'
import { deriveInstructorCohorts, getStudentName } from '#/lib/instructor-workspace'

export const Route = createFileRoute('/instructor/dashboard')({
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
      <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="Dashboard"
          title="Loading dashboard"
          subtitle="Fetching instructor workspace data."
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="Dashboard"
          title="Dashboard unavailable"
          subtitle={error.message}
        />
      </div>
    )
  }

  const me = meQuery.data
  const students = studentsQuery.data ?? []
  const modules = modulesQuery.data ?? []
  const assignments = assignmentsQuery.data ?? []
  const submissions = submissionsQuery.data ?? []
  const attendance = attendanceQuery.data ?? []
  const notifications = notificationsQuery.data ?? []
  const grades = gradesQuery.data ?? []
  const cohorts = deriveInstructorCohorts({
    students,
    modules,
    assignments,
    attendance,
  })
  const ungradedSubmissions = submissions.filter(
    (submission) =>
      !grades.some((grade) => grade.submission.id === submission.id),
  )
  const recentAttendanceIssues = attendance.filter(
    (record) => record.status.toLowerCase() !== 'present',
  )

  const stats = [
    {
      icon: LuBookOpenCheck,
      iconBgClassName: 'bg-sky-500',
      iconAccent: '#e0f2fe',
      label: 'Active Cohorts',
      value: String(cohorts.length),
    },
    {
      icon: LuClipboardCheck,
      iconBgClassName: 'bg-violet-500',
      iconAccent: '#ede9fe',
      label: 'Submissions',
      value: String(submissions.length),
    },
    {
      icon: LuClock3,
      iconBgClassName: 'bg-amber-500',
      iconAccent: '#fef3c7',
      label: 'Needs Review',
      value: String(ungradedSubmissions.length),
    },
    {
      icon: LuBell,
      iconBgClassName: 'bg-emerald-500',
      iconAccent: '#d1fae5',
      label: 'Unread Alerts',
      value: String(notifications.filter((item) => !item.isRead).length),
    },
  ]

  const actionItems = ungradedSubmissions.slice(0, 5).map((submission) => ({
    assignmentId: submission.assignment.id,
    title: submission.assignment.title,
    subTitle: `${getStudentName(submission.student)} · ${submission.assignment.module.title}`,
    btnLabel: 'Review',
    icon: LuClipboardCheck,
    iconAccent: '#7dd3fc',
    iconBg: '#082f49',
  }))

  const upcomingItems = assignments
    .slice()
    .sort(
      (left, right) =>
        new Date(`${left.dueDate}T${left.dueTime}`).getTime() -
        new Date(`${right.dueDate}T${right.dueTime}`).getTime(),
    )
    .slice(0, 4)
    .map((assignment) => ({
      assignment: assignment.title,
      module: assignment.module.title,
      date: formatAssignmentDueDate(assignment.dueDate, assignment.dueTime),
    }))

  const announcementItems = notifications.slice(0, 3).map((notification) => ({
    subject: notification.title,
    description: notification.message,
  }))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome back ${me?.firstName ?? 'Instructor'}`}
        subtitle="Live cohort, grading, submission, and notification data."
      />

      <DashboardGrid>
        <DashboardColumn span={9}>
          <StatsSection stats={stats} />
        </DashboardColumn>
      </DashboardGrid>

      <DashboardGrid>
        <DashboardColumn span={6}>
          <SectionFrame label="Needs Attention" className="min-h-[18rem]">
            {actionItems.length > 0 ? (
              <DashboardActionList items={actionItems} />
            ) : (
              <EmptyState text="No submissions are waiting for grading." />
            )}
          </SectionFrame>

          <SectionFrame label="Recent Attendance Issues" className="min-h-[15rem]">
            {recentAttendanceIssues.length > 0 ? (
              <div className="flex flex-col gap-3">
                {recentAttendanceIssues.slice(0, 4).map((record) => (
                  <ItemContainer
                    key={record.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {getStudentName(record.student)}
                      </p>
                      <p className="text-xs text-white/45">
                        {record.cohort.name} · {record.status}
                      </p>
                    </div>
                    <span className="text-xs text-white/45">
                      {formatDateTime(record.attendanceDate)}
                    </span>
                  </ItemContainer>
                ))}
              </div>
            ) : (
              <EmptyState text="No attendance issues found." />
            )}
          </SectionFrame>
        </DashboardColumn>

        <DashboardColumn span={3}>
          <SectionFrame label="Upcoming Deadlines" className="min-h-[24rem]">
            {upcomingItems.length > 0 ? (
              <UpcomingSection items={upcomingItems} />
            ) : (
              <EmptyState text="No assignments scheduled." />
            )}
          </SectionFrame>

          <SectionFrame label="Announcements" className="min-h-[13rem]">
            {announcementItems.length > 0 ? (
              <AnnouncementsSection items={announcementItems} />
            ) : (
              <EmptyState text="No notifications available." />
            )}
          </SectionFrame>

          <SectionFrame label="Quick Actions" className="min-h-[16rem]">
            <QuickActionsSection items={instructorQuickActions} />
          </SectionFrame>
        </DashboardColumn>
      </DashboardGrid>

      <SectionFrame label="Instructor Summary">
        <div className="grid gap-4 md:grid-cols-3">
          <ItemContainer className="space-y-1">
            <p className="text-xs uppercase tracking-[0.18em] text-white/45">
              Instructor
            </p>
            <p className="text-lg font-semibold text-white">
              {getFullName(me?.firstName, me?.lastName) || 'Instructor'}
            </p>
            <p className="text-sm text-white/45">{me?.email}</p>
          </ItemContainer>
          <ItemContainer className="space-y-1">
            <p className="text-xs uppercase tracking-[0.18em] text-white/45">
              Cohorts
            </p>
            <p className="text-lg font-semibold text-white">{cohorts.length}</p>
            <p className="text-sm text-white/45">Derived from live roster data</p>
          </ItemContainer>
          <ItemContainer className="space-y-1">
            <p className="text-xs uppercase tracking-[0.18em] text-white/45">
              Students
            </p>
            <p className="text-lg font-semibold text-white">{students.length}</p>
            <p className="text-sm text-white/45">Across all visible cohorts</p>
          </ItemContainer>
        </div>
      </SectionFrame>
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return <p className="text-sm text-white/45">{text}</p>
}
