import { LuClock, LuMessageCircleWarning } from 'react-icons/lu'
import ActionItem from './ActionItem'

const dummyData = [
  {
    icon: <LuClock size={20} color="yellow" />,
    title: 'Node.js Final Project Due Soon',
    subTitle: 'Submit by Feb 20, 2026 - 11:59 PM',
    btnLabel: 'Submit',
    variant: 'caution',
  },
  {
    icon: <LuMessageCircleWarning size={20} color="red" />,
    title: 'Missing Attendance - React Workshop',
    subTitle: 'Contact instructor for makeup session',
    btnLabel: 'Submit',
    variant: 'warning',
  },
  {
    icon: <LuClock size={20} color="yellow" />,
    title: 'Node.js Final Project Due Soon',
    subTitle: 'Submit by Feb 20, 2026 - 11:59 PM',
    btnLabel: 'Submit',
    variant: 'caution',
  },
]

const ActionsSection = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {dummyData.map((item, index) => (
        <ActionItem
          key={`${item.title}-${index}`}
          icon={item.icon}
          title={item.title}
          subTitle={item.subTitle}
          btnLabel={item.btnLabel}
          variant={item.variant}
        />
      ))}
    </div>
  )
}

export default ActionsSection
