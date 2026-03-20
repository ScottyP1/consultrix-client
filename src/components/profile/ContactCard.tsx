import ItemContainer from '../ItemContainer'
import GlassContainer from '../liquidGlass/GlassContainer'
import type { ProfileContactItem } from '#/data/profile/types'

const ContactCard = ({ items }: { items: ProfileContactItem[] }) => {
  return (
    <GlassContainer className="flex flex-col gap-4">
      <h2 className="text-2xl">Personal Information</h2>

      <div className="grid grid-cols-2 gap-8">
        {items.map((item) => (
          <ContactItem
            key={item.label}
            label={item.label}
            icon={item.icon}
            value={item.value}
          />
        ))}
      </div>
    </GlassContainer>
  )
}

export default ContactCard

const ContactItem = ({
  label,
  icon,
  value,
}: {
  label: string
  icon: ProfileContactItem['icon']
  value: string
}) => {
  const Icon = icon

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-white/45">{label}</span>
      <ItemContainer>
        <span className="flex gap-4">
          <Icon size={20} color="gray" /> {value}
        </span>
      </ItemContainer>
    </div>
  )
}
