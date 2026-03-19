import ItemContainer from '#/components/ItemContainer'
import type { DashboardAnnouncementItem } from '#/data/dashboard/types'

const AnnouncementsSection = ({
  items,
}: {
  items: DashboardAnnouncementItem[]
}) => {
  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <ItemContainer
          key={item.subject}
          className="flex flex-col justify-center"
        >
          <h4>{item.subject}</h4>
          <span className="text-sm text-white/45">{item.description}</span>
        </ItemContainer>
      ))}
    </div>
  )
}

export default AnnouncementsSection
