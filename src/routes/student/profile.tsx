import { createFileRoute } from '@tanstack/react-router'

import PageHeader from '#/components/PageHeader'
import AvatarCard from '#/components/profile/AvatarCard'
import ContactCard from '#/components/profile/ContactCard'
import CohortCard from '#/components/profile/CohortCard'
import ProgressCard from '#/components/profile/ProgressCard'
import SkillCard from '#/components/profile/SkillCard'

export const Route = createFileRoute('/student/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <PageHeader
        eyebrow="My Profile"
        subtitle="Manage your personal information and progress"
      />

      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1 space-y-4">
          <AvatarCard />
          <SkillCard />
        </div>
        <div className="col-span-3 space-y-4">
          <ContactCard />
          <CohortCard />
          <ProgressCard />
        </div>
      </div>
    </div>
  )
}
