import ItemContainer from '../ItemContainer'
import GlassContainer from '../liquidGlass/GlassContainer'
import { LuAward } from 'react-icons/lu'
import type { ProfileMetricItem } from '#/data/profile/types'

const ProgressCard = ({
  title,
  items,
}: {
  title: string
  items: ProfileMetricItem[]
}) => {
  return (
    <GlassContainer className="flex flex-col gap-4">
      <h2 className="text-2xl">{title}</h2>

      <div className="grid grid-cols-4 gap-4">
        {items.map((item) => (
          <ProgressItem
            key={item.title}
            title={item.title}
            value={item.value}
            color={item.color}
            icon={item.icon}
          />
        ))}
      </div>
    </GlassContainer>
  )
}

export default ProgressCard

const ProgressItem = ({
  title,
  value,
  color,
  icon,
}: {
  title: string
  value: string
  color: string
  icon?: ProfileMetricItem['icon']
}) => {
  const Icon = icon ?? LuAward

  return (
    <ItemContainer
      className="flex flex-col justify-center items-center gap-2"
      style={{ backgroundColor: color }}
    >
      <Icon size={30} color={color} />
      <h3>{value}</h3>
      <span>{title}</span>
    </ItemContainer>
  )
}
