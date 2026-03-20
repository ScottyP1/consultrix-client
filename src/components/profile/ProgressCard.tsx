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
      className="flex flex-col items-center justify-center gap-2 border border-white/6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
      style={{
        background: `linear-gradient(180deg, ${toRgba(color, 0.2)} 0%, ${toRgba(
          color,
          0.13,
        )} 100%)`,
      }}
    >
      <Icon size={24} color={color} />
      <h3 className="text-2xl font-semibold text-white">{value}</h3>
      <span className="text-sm text-white/55">{title}</span>
    </ItemContainer>
  )
}

function toRgba(hex: string, alpha: number) {
  const normalized = hex.replace('#', '')
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((part) => part + part)
          .join('')
      : normalized

  const red = Number.parseInt(value.slice(0, 2), 16)
  const green = Number.parseInt(value.slice(2, 4), 16)
  const blue = Number.parseInt(value.slice(4, 6), 16)

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}
