import { createFileRoute } from '@tanstack/react-router'

import DashboardGrid, {
  DashboardColumn,
} from '#/components/dashboard/DashboardGrid'
import ActionsSection from '#/components/dashboard/student/ActionsSection'
import SectionFrame from '#/components/dashboard/SectionFrame'
import StatsSection from '#/components/dashboard/student/StatsSection'
import UpcomingSection from '#/components/dashboard/student/UpcomingSection'
import PageHeader from '#/components/PageHeader'

import { LuCalendarDays } from 'react-icons/lu'
import ProgressSection from '#/components/dashboard/student/ProgressSection'
import AnnouncementsSection from '#/components/dashboard/student/AnnouncementsSection'
import RecentFeedbackSection from '#/components/dashboard/student/RecentFeedbackSection'
import QuickActionsSection from '#/components/dashboard/student/QuickActionsSection'

export const Route = createFileRoute('/student/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome back tim`}
        subtitle="Here's your latest progress and upcoming activity."
      />

      <StatsSection />

      <DashboardGrid>
        <DashboardColumn span={6}>
          <SectionFrame
            label="Actions required"
            className="min-h-[18rem] max-h-[20rem]"
          >
            <ActionsSection />
          </SectionFrame>

          <SectionFrame
            label="Course Progress"
            className="min-h-[15rem] max-h-[18rem]"
          >
            <ProgressSection />
          </SectionFrame>

          <SectionFrame
            label="Recent Feedback"
            className="min-h-[16rem] max-h-[18rem]"
          >
            <RecentFeedbackSection />
          </SectionFrame>
        </DashboardColumn>

        <DashboardColumn span={3}>
          <SectionFrame
            className="min-h-[24rem] max-h-[25rem]"
            label="Schedule"
            labelIcon={<LuCalendarDays size={20} />}
          >
            <UpcomingSection />
          </SectionFrame>

          <SectionFrame
            label="Announcements"
            className="min-h-[13rem] max-h-[15rem]"
          >
            <AnnouncementsSection />
          </SectionFrame>

          <SectionFrame
            label="Quick Actions"
            className="min-h-[16rem] max-h-[18rem]"
          >
            <QuickActionsSection />
          </SectionFrame>
        </DashboardColumn>
      </DashboardGrid>
    </div>
  )
}
