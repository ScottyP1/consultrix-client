import { useState } from 'react'

import GradesModuleCard, { type GradeModule } from './GradesModuleCard'

const gradeModules: GradeModule[] = [
  {
    id: 'javascript-fundamentals',
    title: 'JavaScript Fundamentals',
    courseAveragePercent: 91,
    assignments: [
      {
        id: 'variables-quiz',
        title: 'Variables Quiz',
        weightPercent: 10,
        gradePercent: 95,
        status: 'graded',
      },
      {
        id: 'functions-lab',
        title: 'Functions Lab',
        weightPercent: 15,
        gradePercent: 88,
        status: 'graded',
      },
      {
        id: 'final-project',
        title: 'Final Project',
        weightPercent: 25,
        gradePercent: 92,
        status: 'graded',
      },
    ],
  },
  {
    id: 'react-development',
    title: 'React Development',
    courseAveragePercent: 87.5,
    assignments: [
      {
        id: 'components-lab',
        title: 'Components Lab',
        weightPercent: 15,
        gradePercent: 90,
        status: 'graded',
      },
      {
        id: 'hooks-assignment',
        title: 'Hooks Assignment',
        weightPercent: 15,
        gradePercent: 85,
        status: 'graded',
      },
      {
        id: 'state-management',
        title: 'State Management',
        weightPercent: 20,
        gradePercent: null,
        status: 'pending',
      },
    ],
  },
]

const GradesModulesList = () => {
  const [openModuleId, setOpenModuleId] = useState<string | null>(
    gradeModules[0]?.id ?? null
  )

  return (
    <div className="space-y-6">
      {gradeModules.map((module) => (
        <GradesModuleCard
          key={module.id}
          module={module}
          isOpen={openModuleId === module.id}
          onToggle={() =>
            setOpenModuleId((current) =>
              current === module.id ? null : module.id
            )
          }
        />
      ))}
    </div>
  )
}

export default GradesModulesList
