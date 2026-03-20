import { createFileRoute } from '@tanstack/react-router'

import DashboardGrid, {
  DashboardColumn,
} from '#/components/dashboard/DashboardGrid'
import DashboardActionList from '#/components/dashboard/DashboardActionList'
import SectionFrame from '#/components/dashboard/SectionFrame'
import StatsSection from '#/components/dashboard/StatsSection'
import UpcomingSection from '#/components/dashboard/UpcomingSection'
import PageHeader from '#/components/PageHeader'

import { LuCalendarDays } from 'react-icons/lu'
import ProgressSection from '#/components/dashboard/ProgressSection'
import AnnouncementsSection from '#/components/dashboard/AnnouncementsSection'
import RecentFeedbackSection from '#/components/dashboard/RecentFeedbackSection'
import QuickActionsSection from '#/components/dashboard/QuickActionsSection'
import {
  studentActionItems,
  studentAnnouncements,
  studentProgressItems,
  studentQuickActions,
  studentRecentFeedbackItems,
  studentStats,
  studentUpcomingItems,
} from '#/data/dashboard/student'

import { useStudent } from '#/hooks/student/useStudent'

export const Route = createFileRoute('/student/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = useStudent()
  const firstName = data?.firstName?.trim() || 'Student'

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
            <DashboardActionList items={studentActionItems} />
          </SectionFrame>

          <SectionFrame
            label="Course Progress"
            className="min-h-[15rem] max-h-[18rem]"
          >
            <ProgressSection items={studentProgressItems} />
          </SectionFrame>

          <SectionFrame
            label="Recent Feedback"
            className="min-h-[16rem] max-h-[18rem]"
          >
            <RecentFeedbackSection items={studentRecentFeedbackItems} />
          </SectionFrame>
        </DashboardColumn>

        <DashboardColumn span={3}>
          <SectionFrame
            className="min-h-[24rem] max-h-[25rem]"
            label="Schedule"
          >
            <UpcomingSection items={studentUpcomingItems} />
          </SectionFrame>

          <SectionFrame
            label="Announcements"
            className="min-h-[13rem] max-h-[15rem]"
          >
            <AnnouncementsSection items={studentAnnouncements} />
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
