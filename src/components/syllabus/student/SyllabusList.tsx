import { useState } from 'react'

import ItemContainer from '#/components/ItemContainer'
import GlassContainer from '#/components/liquidGlass/GlassContainer'
import { ProgressBar } from '#/components/dashboard/student/ProgressSection'

import {
  LuBookOpen,
  LuCheck,
  LuChevronDown,
  LuChevronUp,
  LuClock,
} from 'react-icons/lu'

const syllabusData = [
  {
    module: 'Javascript fundamentals',
    completionPercentage: '85%',
    moduleDuration: '4 weeks',
    assignments: [
      { status: 'complete', title: 'dummy title' },
      { status: 'incomplete', title: 'dummy title' },
      { status: 'complete', title: 'dummy title' },
      { status: 'complete', title: 'dummy title' },
      { status: 'incomplete', title: 'dummy title' },
      { status: 'complete', title: 'dummy title' },
    ],
  },
  {
    module: 'React',
    completionPercentage: '45%',
    moduleDuration: '1 week',
    assignments: [
      { status: 'complete', title: 'dummy title' },
      { status: 'incomplete', title: 'dummy title' },
      { status: 'complete', title: 'dummy title' },
      { status: 'incomplete', title: 'dummy title' },
      { status: 'complete', title: 'dummy title' },
    ],
  },
  {
    module: 'SQL',
    completionPercentage: '65%',
    moduleDuration: '6 weeks',
    assignments: [
      { status: 'complete', title: 'dummy title' },
      { status: 'incomplete', title: 'dummy title' },
      { status: 'complete', title: 'dummy title' },
    ],
  },
  {
    module: 'SpringBoot',
    completionPercentage: '25%',
    moduleDuration: '4 weeks',
    assignments: [
      { status: 'complete', title: 'dummy title' },
      { status: 'incomplete', title: 'dummy title' },
      { status: 'complete', title: 'dummy title' },
    ],
  },
]

const SyllabusList = () => {
  const [openModule, setOpenModule] = useState<string | null>(
    syllabusData[0]?.module ?? null,
  )

  return (
    <div className="space-y-4">
      {syllabusData.map((item) => {
        const isOpen = openModule === item.module

        return (
          <GlassContainer key={item.module} className="flex flex-col gap-4 p-5">
            <button
              type="button"
              className="flex items-start justify-between gap-4 text-left"
              onClick={() =>
                setOpenModule((current) =>
                  current === item.module ? null : item.module,
                )
              }
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-white/55">
                      {isOpen ? (
                        <LuChevronUp size={18} />
                      ) : (
                        <LuChevronDown size={18} />
                      )}
                    </span>
                    <h2 className="text-lg font-semibold text-white">
                      {item.module}
                    </h2>
                  </div>

                  <span className="text-sm text-white/55">
                    {item.completionPercentage}
                  </span>
                </div>
                <div className="flex gap-4">
                  <span className="flex items-center gap-2 text-xs text-white/45">
                    <LuClock /> {item.moduleDuration}
                  </span>
                  <span className="flex items-center gap-2 text-xs text-white/45">
                    <LuBookOpen /> {item.assignments.length}
                  </span>
                </div>
              </div>
            </button>

            <ProgressBar
              value={item.completionPercentage}
              color="bg-linear-to-r from-cyan-500 to-blue-500"
            />

            {isOpen && (
              <div className="space-y-3">
                {item.assignments.map((assignment, index) => (
                  <ItemContainer
                    key={`${item.module}-${assignment.title}-${index}`}
                    className="flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium text-white">
                        {assignment.title}
                      </h3>
                      <p className="text-xs uppercase tracking-[0.16em] text-white/45">
                        Assignment
                      </p>
                    </div>

                    <span
                      className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs uppercase tracking-[0.16em] ${
                        assignment.status === 'complete'
                          ? 'bg-emerald-500/18 text-emerald-300'
                          : 'bg-amber-500/18 text-amber-300'
                      }`}
                    >
                      {assignment.status === 'complete' && (
                        <LuCheck size={14} />
                      )}
                      {assignment.status}
                    </span>
                  </ItemContainer>
                ))}
              </div>
            )}
          </GlassContainer>
        )
      })}
    </div>
  )
}

export default SyllabusList
