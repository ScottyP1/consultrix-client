import ItemContainer from '../ItemContainer'
import GlassContainer from '../liquidGlass/GlassContainer'
import {
  LucideMail,
  LucidePhone,
  LucideMapPin,
  LucideCalendar,
} from 'lucide-react'

const contactData = [
  {
    icon: <LucideMail size={20} color="gray" />,
    label: 'Email',
    value: 'Alex.johnson.email.com',
  },
  {
    icon: <LucidePhone size={20} color="gray" />,
    label: 'Phone',
    value: '(555) 123-4567',
  },
  {
    icon: <LucideMapPin size={20} color="gray" />,
    label: 'Location',
    value: 'Jeffersonville, OH',
  },
  {
    icon: <LucideCalendar size={20} color="gray" />,
    label: 'Enrollment Date',
    value: 'Jan 5, 2026',
  },
]
const ContactCard = () => {
  return (
    <GlassContainer className="flex flex-col gap-4">
      <h2 className="text-2xl">Personal Information</h2>

      <div className="grid grid-cols-2 gap-8">
        {contactData.map((item) => (
          <ContactItem label={item.label} icon={item.icon} value={item.value} />
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
  icon: React.ReactElement
  value: string
}) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-white/45">{label}</span>
      <ItemContainer>
        <span className="flex gap-4">
          {icon} {value}
        </span>
      </ItemContainer>
    </div>
  )
}
