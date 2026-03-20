import { createFileRoute } from '@tanstack/react-router'

import PageHeader from '#/components/PageHeader'
import AvatarCard from '#/components/profile/AvatarCard'
import ContactCard from '#/components/profile/ContactCard'
import CohortCard from '#/components/profile/CohortCard'
import ProgressCard from '#/components/profile/ProgressCard'
import SkillCard from '#/components/profile/SkillCard'
import { instructorProfile } from '#/data/profile/instructor'

export const Route = createFileRoute('/instructor/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <PageHeader
        eyebrow={instructorProfile.eyebrow}
        subtitle={instructorProfile.subtitle}
      />

      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1 space-y-4">
          <AvatarCard {...instructorProfile.avatar} />
          <SkillCard skills={instructorProfile.skills} />
        </div>
        <div className="col-span-3 space-y-4">
          <ContactCard items={instructorProfile.contacts} />
          <CohortCard
            title={instructorProfile.cohortInfoTitle}
            items={instructorProfile.cohortInfo}
          />
          <ProgressCard
            title={instructorProfile.metricsTitle}
            items={instructorProfile.metrics}
          />
        </div>
      </div>
    </div>
  )
}
