import GlassContainer from '../liquidGlass/GlassContainer'

import { MdOutlineElectricBolt } from 'react-icons/md'
import {
  LuBrain,
  LuEye,
  LuUserRoundCheck,
  LuRocket,
  LuMessageSquare,
} from 'react-icons/lu'

import Header from './Header'

const data = [
  {
    icon: <MdOutlineElectricBolt size={34} />,
    title: 'Operational Efficiency',
    subTitle:
      'Streamline workflows and eliminate redundant processes across all stakeholder groups',
  },
  {
    icon: <LuEye size={34} />,
    title: 'Real-Time Visibility',
    subTitle:
      'Access up-to-date information on cohorts, warehouses, and placement pipelines',
  },
  {
    icon: <LuUserRoundCheck size={34} />,
    title: 'Improved Student Outcomes',
    subTitle:
      'Early identification of at-risk students and targeted intervention strategies',
  },
  {
    icon: <LuBrain size={34} />,
    title: 'Data-Driven Decision Making',
    subTitle:
      'Leverage analytics and reporting to inform strategic planning and resource allocation',
  },
  {
    icon: <LuRocket size={34} />,
    title: 'Scalable Workforce Development',
    subTitle:
      'Expand training capacity and optimize warehouse utilization as demand grows',
  },
  {
    icon: <LuMessageSquare size={34} />,
    title: 'Centralized Communication',
    subTitle:
      'Unified notification system keeps all stakeholders informed and aligned',
  },
]

const BenefitsSection = () => {
  return (
    <div>
      <div className="flex flex-col gap-24">
        <Header
          title="Strategic advantages of the unified platform"
          subTitle="KEY BENEFITS"
        />
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3">
          {data.map((item) => (
            <BenefitsCard
              key={item.title}
              icon={item.icon}
              title={item.title}
              subTitle={item.subTitle}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
export default BenefitsSection

const BenefitsCard = ({
  icon,
  title,
  subTitle,
}: {
  icon: React.ReactElement
  title: string
  subTitle: string
}) => {
  return (
    <GlassContainer
      className="relative flex h-full min-h-[20rem] flex-col items-center justify-center gap-6 rounded-3xl border-white/10 p-6 text-center"
      style={{ background: 'rgba(255,255,255,0.04)' }}
    >
      <div
        className="flex h-15 w-15 items-center justify-center rounded-2xl border border-white/10 text-white/90"
        style={{ background: 'rgba(255,255,255,0.06)' }}
      >
        {icon}
      </div>
      <h3>{title}</h3>
      <p>{subTitle}</p>
    </GlassContainer>
  )
}
