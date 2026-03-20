import { createFileRoute } from '@tanstack/react-router'
import { LuBell, LuClipboardCheck, LuClock3 } from 'react-icons/lu'

import DashboardGrid, {
  DashboardColumn,
} from '#/components/dashboard/DashboardGrid'
import DashboardActionList from '#/components/dashboard/DashboardActionList'
import SectionFrame from '#/components/dashboard/SectionFrame'
import StatsSection from '#/components/dashboard/StatsSection'
import UpcomingSection from '#/components/dashboard/UpcomingSection'
import PageHeader from '#/components/PageHeader'
import ProgressSection from '#/components/dashboard/ProgressSection'
import AnnouncementsSection from '#/components/dashboard/AnnouncementsSection'
import RecentFeedbackSection from '#/components/dashboard/RecentFeedbackSection'
import QuickActionsSection from '#/components/dashboard/QuickActionsSection'
import {
  studentQuickActions,
  studentStats as studentStatsSeed,
} from '#/data/dashboard/student'
import type {
  DashboardActionItemData,
  DashboardAnnouncementItem,
  DashboardProgressItem,
  DashboardUpcomingItem,
} from '#/data/dashboard/types'
import { useStudentDashboardData } from '#/hooks/student/useStudentDashboardData'
import { formatAssignmentDueDate } from '#/lib/consultrix-format'

export const Route = createFileRoute('/student/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const {
    profileQuery,
    attendanceQuery,
    assignmentsQuery,
    gradesQuery,
    notificationsQuery,
    isLoading,
    error,
  } = useStudentDashboardData()

  const student = profileQuery.data
  const attendance = attendanceQuery.data
  const assignments = assignmentsQuery.data ?? []
  const grades = gradesQuery.data ?? []
  const notifications = notificationsQuery.data ?? []

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="Dashboard"
          title="Loading dashboard"
          subtitle="Fetching your latest student data."
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
          subtitle={
            error instanceof Error
              ? error.message
              : 'Unable to load your dashboard right now.'
          }
        />
      </div>
    )
  }

  const firstName = student?.firstName?.trim() || 'Student'
  const latestGrade = grades[0]
  const unreadNotifications = notifications.filter((item) => !item.isRead)
  const overdueAssignments = assignments.filter(
    (assignment) => assignment.courseworkStatus === 'LATE',
  )

  const studentStats = studentStatsSeed.map((stat) => {
    if (stat.label === 'Current Grade') {
      return {
        ...stat,
        value:
          latestGrade?.overallGradePercentage != null
            ? `${latestGrade.overallGradePercentage}%`
            : '--',
      }
    }

    if (stat.label === 'Attendance') {
      return {
        ...stat,
        value:
          attendance?.attendanceRate != null
            ? `${attendance.attendanceRate}%`
            : '--',
      }
    }

    if (stat.label === 'Tickets') {
      return {
        ...stat,
        value: String(unreadNotifications.length),
      }
    }

    if (stat.label === 'Past Due') {
      return {
        ...stat,
        value: String(overdueAssignments.length),
      }
    }

    return stat
  })

  const actionItems: DashboardActionItemData[] = assignments
    .filter((assignment) => assignment.courseworkStatus !== 'GRADED')
    .slice(0, 3)
    .map((assignment) => {
      const dueDate = formatAssignmentDueDate(
        assignment.dueDate,
        assignment.dueTime,
      )
      const isSubmitted = assignment.courseworkStatus === 'SUBMITTED'

      return {
        icon: isSubmitted ? LuClipboardCheck : LuClock3,
        iconAccent: isSubmitted ? '#0C8CE9' : '#FEAF15',
        iconBg: isSubmitted ? '#113745' : '#47311B',
        title: assignment.title,
        subTitle: `Due ${dueDate}`,
        btnLabel: isSubmitted ? 'Review' : 'Submit',
      }
    })

  const progressItems: DashboardProgressItem[] = buildProgressItems(
    grades,
    assignments,
  )
  const upcomingItems: DashboardUpcomingItem[] = assignments
    .slice()
    .sort(
      (left, right) =>
        getDueTimestamp(left.dueDate, left.dueTime) -
        getDueTimestamp(right.dueDate, right.dueTime),
    )
    .slice(0, 3)
    .map((assignment) => ({
      assignment: assignment.title,
      module: assignment.moduleTitle,
      date: formatAssignmentDueDate(assignment.dueDate, assignment.dueTime),
    }))

  const announcementItems: DashboardAnnouncementItem[] = notifications
    .slice(0, 3)
    .map((notification) => ({
      subject: notification.title,
      description: notification.message,
    }))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome back ${firstName}`}
        subtitle="Here's your latest progress and upcoming activity."
      />

      <DashboardGrid>
        <DashboardColumn span={9}>
          <StatsSection stats={studentStats} />
        </DashboardColumn>
      </DashboardGrid>

      <DashboardGrid>
        <DashboardColumn span={6}>
          <SectionFrame
            label="Actions required"
            className="min-h-[18rem] max-h-[20rem]"
          >
            {actionItems.length > 0 ? (
              <DashboardActionList items={actionItems} />
            ) : (
              <EmptySectionCopy text="No open assignment actions right now." />
            )}
          </SectionFrame>

          <SectionFrame
            label="Course Progress"
            className="min-h-[15rem] max-h-[18rem]"
          >
            {progressItems.length > 0 ? (
              <ProgressSection items={progressItems} />
            ) : (
              <EmptySectionCopy text="No graded modules yet." />
            )}
          </SectionFrame>

          <SectionFrame
            label="Recent Feedback"
            className="min-h-[16rem] max-h-[18rem]"
          >
            <RecentFeedbackSection feedbackItem={latestGrade} />
          </SectionFrame>
        </DashboardColumn>

        <DashboardColumn span={3}>
          <SectionFrame
            className="min-h-[24rem] max-h-[25rem]"
            label="Schedule"
          >
            {upcomingItems.length > 0 ? (
              <UpcomingSection items={upcomingItems} />
            ) : (
              <EmptySectionCopy text="No upcoming assignments available." />
            )}
          </SectionFrame>

          <SectionFrame
            label="Announcements"
            className="min-h-[13rem] max-h-[15rem]"
          >
            {announcementItems.length > 0 ? (
              <AnnouncementsSection items={announcementItems} />
            ) : (
              <EmptySectionCopy text="No notifications available." />
            )}
          </SectionFrame>

          <SectionFrame
            label="Quick Actions"
            className="min-h-[16rem] max-h-[18rem]"
          >
            <QuickActionsSection items={studentQuickActions} />
          </SectionFrame>
        </DashboardColumn>
      </DashboardGrid>
    </div>
  )
}

function buildProgressItems(
  grades: {
    moduleId: number
    moduleGradePercentage: number
  }[],
  assignments: {
    moduleId: number
  }[],
): DashboardProgressItem[] {
  const moduleGrades = new Map<number, number>()
  const moduleOrder = new Map<number, number>()

  grades.forEach((grade) => {
    if (!moduleGrades.has(grade.moduleId)) {
      moduleGrades.set(grade.moduleId, grade.moduleGradePercentage)
    }
  })

  assignments.forEach((assignment) => {
    if (!moduleOrder.has(assignment.moduleId)) {
      moduleOrder.set(assignment.moduleId, moduleOrder.size + 1)
    }
  })

  const colors = [
    'bg-linear-to-r from-cyan-500 to-blue-500',
    'bg-linear-to-t from-sky-500 to-indigo-500',
    'bg-linear-to-bl from-violet-500 to-fuchsia-500',
    'bg-linear-65 from-emerald-500 to-cyan-500',
  ]

  return Array.from(moduleGrades.entries())
    .sort(
      ([leftModuleId], [rightModuleId]) =>
        (moduleOrder.get(leftModuleId) ?? Number.MAX_SAFE_INTEGER) -
        (moduleOrder.get(rightModuleId) ?? Number.MAX_SAFE_INTEGER),
    )
    .map(([moduleId, percentage], index) => ({
      label: `Module ${moduleOrder.get(moduleId) ?? index + 1}`,
      value: `${percentage}%`,
      color: colors[index % colors.length],
      variant: 'Dashboard',
    }))
}

function getDueTimestamp(dueDate?: string | null, dueTime?: string | null) {
  const value =
    dueDate && dueTime
      ? dueTime.includes('T')
        ? dueTime
        : `${dueDate}T${dueTime}`
      : dueDate ?? dueTime ?? ''
  const timestamp = new Date(value).getTime()

  return Number.isFinite(timestamp) ? timestamp : Number.MAX_SAFE_INTEGER
}

function EmptySectionCopy({ text }: { text: string }) {
  return (
    <div className="flex min-h-[8rem] items-center justify-center text-sm text-white/45">
      {text}
    </div>
  )
}
