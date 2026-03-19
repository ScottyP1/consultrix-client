import ItemContainer from '../ItemContainer'
import GlassContainer from '../liquidGlass/GlassContainer'
import type { ProfileInfoItem } from '#/data/profile/types'

const CohortCard = ({
  title,
  items,
}: {
  title: string
  items: ProfileInfoItem[]
}) => {
  return (
    <GlassContainer className="flex flex-col gap-4">
      <h2 className="text-2xl">{title}</h2>

      <div className="grid grid-cols-3 gap-4">
        {items.map((item) => (
          <ItemContainer key={item.title} className="flex flex-col">
            <h3 className="text-sm text-white/45">{item.title}</h3>
            <span>{item.subtitle}</span>
          </ItemContainer>
        ))}
      </div>
    </GlassContainer>
  )
}

export default CohortCard
