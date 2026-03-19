import ItemContainer from '../ItemContainer'
import GlassContainer from '../liquidGlass/GlassContainer'

const cohortData = [
  { title: 'Cohort', subtitle: 'Full Stack Development 2024-Q1' },
  { title: 'Start Date', subtitle: 'January 5, 2026' },
  { title: 'Expected Completion', subtitle: 'April 30 2026' },
]

const CohortCard = () => {
  return (
    <GlassContainer className="flex flex-col gap-4">
      <h2 className="text-2xl">Cohort Information</h2>

      <div className="grid grid-cols-3 gap-4">
        {cohortData.map((item) => (
          <ItemContainer className="flex flex-col">
            <h3 className="text-sm text-white/45">{item.title}</h3>
            <span>{item.subtitle}</span>
          </ItemContainer>
        ))}
      </div>
    </GlassContainer>
  )
}

export default CohortCard
