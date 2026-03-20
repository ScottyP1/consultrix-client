import { useState } from 'react'

import GradesModuleCard, { type GradeModule } from './GradesModuleCard'

const GradesModulesList = ({ modules }: { modules: GradeModule[] }) => {
  const [openModuleId, setOpenModuleId] = useState<string | null>(
    modules[0]?.id ?? null
  )

  return (
    <div className="space-y-6">
      {modules.map((module) => (
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
