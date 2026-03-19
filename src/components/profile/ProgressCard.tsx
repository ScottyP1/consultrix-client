import ItemContainer from '../ItemContainer'
import GlassContainer from '../liquidGlass/GlassContainer'

import { LuAward } from 'react-icons/lu'

const progressData = [
  { title: 'Grade', value: '98%', color: '#7C86FF' },
  { title: 'Progress', value: '85%', color: '#C179FE' },
  { title: 'Completed', value: '50', color: '#00D3F3' },
  { title: 'Badges', value: '5', color: '#05DB70' },
]
const ProgressCard = () => {
  return (
    <GlassContainer className="flex flex-col gap-4">
      <h2 className="text-2xl">Progress Summary</h2>

      <div className="grid grid-cols-4 gap-4">
        {progressData.map((item) => (
          <ProgressItem
            title={item.title}
            value={item.value}
            color={item.color}
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
}: {
  title: string
  value: string
  color: string
}) => {
  return (
    <ItemContainer
      className={`flex flex-col justify-center items-center gap-2 bg-[${color}]`}
    >
      <LuAward size={30} color={color} />
      <h3>{value}</h3>
      <span>{title}</span>
    </ItemContainer>
  )
}
