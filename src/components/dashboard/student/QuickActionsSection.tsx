import { LuMessageSquare, LuBookOpen, LuCalendar } from 'react-icons/lu'

const quickActions = [
  {
    icon: <LuMessageSquare color="#99A8FD" />,
    title: 'Message Instructor',
    bgColor: 'bg-[#26254B]',
    accent: 'text-[#99A8FD]',
  },
  {
    icon: <LuBookOpen color="#AC84D3" />,
    title: 'Browse Resources',
    bgColor: 'bg-[#341E4C]',
    accent: 'text-[#AC84D3]',
  },
  {
    icon: <LuCalendar color="#4ADEED" />,
    title: 'Schedule Study Session',
    bgColor: 'bg-[#143A43]',
    accent: 'text-[#4ADEED]',
  },
]
const QuickActionsSection = () => {
  return (
    <div className="flex flex-col gap-4">
      {quickActions.map((item) => (
        <div
          className={`flex gap-2 p-4 items-center rounded-lg ${item.bgColor}`}
        >
          {item.icon}
          <h4 className={`${item.accent}`}>{item.title}</h4>
        </div>
      ))}
    </div>
  )
}

export default QuickActionsSection
