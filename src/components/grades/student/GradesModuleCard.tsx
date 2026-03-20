import GlassContainer from '#/components/liquidGlass/GlassContainer'
import { LuChevronDown, LuChevronUp } from 'react-icons/lu'

import GradesAssignmentRow from './GradesAssignmentRow'

type GradeStatus = 'graded' | 'pending' | 'missing'

export type GradeModule = {
  id: string
  title: string
  courseAveragePercent: number
  assignments: {
    id: string
    title: string
    maxScore: number
    gradePercent: number | null
    status: GradeStatus
  }[]
}

type GradesModuleCardProps = {
  module: GradeModule
  isOpen: boolean
  onToggle: () => void
}

const GradesModuleCard = ({
  module,
  isOpen,
  onToggle,
}: GradesModuleCardProps) => {
  return (
    <GlassContainer className="p-6">
      <div className="space-y-6">
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full items-start justify-between gap-4 text-left"
        >
          <div className="flex items-center gap-3">
            <span className="text-white/55">
              {isOpen ? <LuChevronUp size={20} /> : <LuChevronDown size={20} />}
            </span>

            <h2 className="text-2xl font-semibold tracking-tight text-white">
              {module.title}
            </h2>
          </div>

          <div className="text-right">
            <h3 className="text-xl font-semibold tracking-tight text-white">
              {module.courseAveragePercent}%
            </h3>
            <p className="text-sm text-white/45">Course Average</p>
          </div>
        </button>

        {isOpen && (
          <>
            <div className="grid grid-cols-[minmax(0,2.2fr)_0.8fr_0.8fr_0.8fr] gap-4 px-0 pb-1 text-sm font-medium text-white/55">
              <div>Assignment</div>
              <div>Max Score</div>
              <div>Grade</div>
              <div>Status</div>
            </div>

            <div>
              {module.assignments.map((assignment) => (
                <GradesAssignmentRow
                  key={assignment.id}
                  title={assignment.title}
                  maxScore={assignment.maxScore}
                  gradePercent={assignment.gradePercent}
                  status={assignment.status}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </GlassContainer>
  )
}

export default GradesModuleCard
