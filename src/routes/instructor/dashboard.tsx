import { createFileRoute } from '@tanstack/react-router'
import { LuCalendarDays } from 'react-icons/lu'

import PageHeader from '#/components/PageHeader'
import AnnouncementsSection from '#/components/dashboard/AnnouncementsSection'
import DashboardActionList from '#/components/dashboard/DashboardActionList'
import DashboardGrid, {
  DashboardColumn,
} from '#/components/dashboard/DashboardGrid'
import ProgressSection from '#/components/dashboard/ProgressSection'
import QuickActionsSection from '#/components/dashboard/QuickActionsSection'
import RecentFeedbackSection from '#/components/dashboard/RecentFeedbackSection'
import SectionFrame from '#/components/dashboard/SectionFrame'
import StatsSection from '#/components/dashboard/StatsSection'
import UpcomingSection from '#/components/dashboard/UpcomingSection'
import {
  instructorActionItems,
  instructorAnnouncements,
  instructorRecentActivityItems,
  instructorProgressItems,
  instructorQuickActions,
  instructorStats,
  instructorUpcomingItems,
} from '#/data/dashboard/instructor'

export const Route = createFileRoute('/instructor/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome back tim`}
        subtitle="Manage your cohorts and monitor student progress"
      />

      <DashboardGrid>
        <DashboardColumn span={9}>
          <StatsSection stats={instructorStats} />
        </DashboardColumn>
      </DashboardGrid>

      <DashboardGrid>
        <DashboardColumn span={6}>
          <SectionFrame
            label="Actions required"
            className="min-h-[18rem] max-h-[20rem]"
          >
            <DashboardActionList items={instructorActionItems} />
          </SectionFrame>

          <SectionFrame
            label="Course Progress"
            className="min-h-[15rem] max-h-[18rem]"
          >
            <ProgressSection items={instructorProgressItems} />
          </SectionFrame>

          <SectionFrame
            label="Recent Activity"
            className="min-h-[16rem] max-h-[18rem]"
          >
            <RecentFeedbackSection items={instructorRecentActivityItems} />
          </SectionFrame>
        </DashboardColumn>

        <DashboardColumn span={3}>
          <SectionFrame
            className="min-h-[24rem] max-h-[25rem]"
            label="Schedule"
          >
            <UpcomingSection items={instructorUpcomingItems} />
          </SectionFrame>

          <SectionFrame
            label="Announcements"
            className="min-h-[13rem] max-h-[15rem]"
          >
            <AnnouncementsSection items={instructorAnnouncements} />
          </SectionFrame>

          <SectionFrame
            label="Quick Actions"
            className="min-h-[16rem] max-h-[18rem]"
          >
            <QuickActionsSection items={instructorQuickActions} />
          </SectionFrame>
        </DashboardColumn>
      </DashboardGrid>
    </div>
  )
}
