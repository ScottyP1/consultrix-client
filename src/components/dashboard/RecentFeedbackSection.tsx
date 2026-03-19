import ItemContainer from '#/components/ItemContainer'
import type { RecentFeedbackItem } from '#/data/dashboard/types'

const RecentFeedbackSection = ({ items }: { items: RecentFeedbackItem[] }) => {
  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => {
        return (
          <ItemContainer
            key={`${item.title}-${item.from}`}
            className="flex flex-col justify-center"
          >
            <h4>{item.title}</h4>
            {/* <span className="text-xs text-white/45">{item.from}</span> */}
            <p className="text-xs text-white/45">{item.description}</p>
          </ItemContainer>
        )
      })}
    </div>
  )
}

export default RecentFeedbackSection
