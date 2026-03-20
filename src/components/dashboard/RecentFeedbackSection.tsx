import ItemContainer from '#/components/ItemContainer'

type RecentFeedbackSectionProps = {
  feedbackItem?: {
    assignmentGradePercentage: number
    assignmentId: number
    feedback: string
    moduleGradePercentage: number
    moduleId: number
    overallGradePercentage: number
    overallLetterGrade: string
    score: number
    submissionId: number
  }
}

const RecentFeedbackSection = ({
  feedbackItem,
}: RecentFeedbackSectionProps) => {
  if (!feedbackItem) {
    return (
      <ItemContainer className="flex min-h-[9rem] items-center justify-center">
        <p className="text-sm text-white/45">No feedback available yet.</p>
      </ItemContainer>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <ItemContainer className="flex flex-col gap-3 justify-center">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="text-sm font-semibold text-white">
              Assignment #{feedbackItem.assignmentId}
            </h4>
            <p className="text-xs text-white/45">
              Module #{feedbackItem.moduleId}
            </p>
          </div>
        </div>

        <p className="text-xs leading-6 text-white/60">
          {feedbackItem.feedback}
        </p>

        <div className="flex items-center gap-3 text-xs text-white/50">
          <span>Score: {feedbackItem.score}</span>
        </div>
      </ItemContainer>
    </div>
  )
}

export default RecentFeedbackSection
