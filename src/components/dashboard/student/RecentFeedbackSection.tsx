import ItemContainer from '#/components/ItemContainer'

const feedbackData = [
  { title: 'React SBA', from: 'Allan', description: 'Great Work', grade: 'B' },
  { title: 'Java SBA', from: 'Allan', description: 'Excellent', grade: 'A' },
]

const RecentFeedbackSection = () => {
  return (
    <div className="flex flex-col gap-4">
      {feedbackData.map((item) => {
        return (
          <ItemContainer className="flex flex-col justify-center">
            <div className="flex justify-between items-center">
              <h4>{item.title}</h4>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-600 text-sm font-medium text-white">
                {item.grade}
              </span>
            </div>
            {/* <span className="text-xs text-white/45">{item.from}</span> */}
            <p className="text-xs text-white/45">{item.description}</p>
          </ItemContainer>
        )
      })}
    </div>
  )
}

export default RecentFeedbackSection
