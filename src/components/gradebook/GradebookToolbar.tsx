import GlassContainer from '#/components/liquidGlass/GlassContainer'
import type { GradebookModule, GradebookStatus } from '#/data/gradebook/types'

const GradebookToolbar = ({
  cohortOptions,
  selectedCohortId,
  onCohortChange,
  modules,
  selectedModuleId,
  onModuleChange,
  statusFilter,
  onStatusChange,
  searchQuery,
  onSearchChange,
}: {
  cohortOptions: { id: string; name: string; term: string }[]
  selectedCohortId: string
  onCohortChange: (value: string) => void
  modules: GradebookModule[]
  selectedModuleId: string
  onModuleChange: (value: string) => void
  statusFilter: 'all' | GradebookStatus
  onStatusChange: (value: 'all' | GradebookStatus) => void
  searchQuery: string
  onSearchChange: (value: string) => void
}) => {
  return (
    <GlassContainer className="p-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.24em] text-white/45">
            Cohort
          </span>
          <select
            value={selectedCohortId}
            onChange={(event) => onCohortChange(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
          >
            {cohortOptions.map((cohort) => (
              <option key={cohort.id} value={cohort.id} className="bg-slate-950">
                {cohort.name} · {cohort.term}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.24em] text-white/45">
            Module
          </span>
          <select
            value={selectedModuleId}
            onChange={(event) => onModuleChange(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
          >
            <option value="all" className="bg-slate-950">
              All Modules
            </option>
            {modules.map((module) => (
              <option key={module.id} value={module.id} className="bg-slate-950">
                {module.title}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.24em] text-white/45">
            Status
          </span>
          <select
            value={statusFilter}
            onChange={(event) =>
              onStatusChange(event.target.value as 'all' | GradebookStatus)
            }
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
          >
            <option value="all" className="bg-slate-950">
              All Statuses
            </option>
            <option value="graded" className="bg-slate-950">
              Graded
            </option>
            <option value="submitted" className="bg-slate-950">
              Submitted
            </option>
            <option value="missing" className="bg-slate-950">
              Missing
            </option>
            <option value="excused" className="bg-slate-950">
              Excused
            </option>
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.24em] text-white/45">
            Search Student
          </span>
          <input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Find by name or email"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none"
          />
        </label>
      </div>
    </GlassContainer>
  )
}

export default GradebookToolbar
