import { createFileRoute } from '@tanstack/react-router'

import PageHeader from '#/components/PageHeader'
import AvatarCard from '#/components/profile/AvatarCard'
import ContactCard from '#/components/profile/ContactCard'
import CohortCard from '#/components/profile/CohortCard'
import ProgressCard from '#/components/profile/ProgressCard'
import SkillCard from '#/components/profile/SkillCard'
import { studentProfile } from '#/data/profile/student'

export const Route = createFileRoute('/student/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <PageHeader
        eyebrow={studentProfile.eyebrow}
        subtitle={studentProfile.subtitle}
      />

      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1 space-y-4">
          <AvatarCard {...studentProfile.avatar} />
          <SkillCard skills={studentProfile.skills} />
        </div>
        <div className="col-span-3 space-y-4">
          <ContactCard items={studentProfile.contacts} />
          <CohortCard
            title={studentProfile.cohortInfoTitle}
            items={studentProfile.cohortInfo}
          />
          <ProgressCard
            title={studentProfile.metricsTitle}
            items={studentProfile.metrics}
          />
        </div>
      </div>
    </div>
  )
}
