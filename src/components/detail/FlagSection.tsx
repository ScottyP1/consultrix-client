import { useState } from 'react'
import { LuFlag, LuCheckCircle, LuAlertTriangle } from 'react-icons/lu'

import GlassContainer from '#/components/liquidGlass/GlassContainer'
import SectionFrame from '#/components/dashboard/SectionFrame'
import type { StudentFlagDto, StudentFlagRequestDto } from '#/api/consultrix'
import { formatDate } from '#/lib/consultrix-format'

interface FlagSectionProps {
  flags: StudentFlagDto[]
  studentId: number
  /** Called when instructor submits a new flag */
  onCreateFlag: (payload: StudentFlagRequestDto) => void
  /** Called when instructor resolves an existing flag */
  onResolveFlag: (flagId: number) => void
  isCreating?: boolean
  isResolving?: boolean
  createError?: Error | null
}

export default function FlagSection({
  flags,
  studentId,
  onCreateFlag,
  onResolveFlag,
  isCreating = false,
  isResolving = false,
  createError,
}: FlagSectionProps) {
  const [showForm, setShowForm] = useState(false)
  const [reason, setReason] = useState('')
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM')

  function handleSubmit() {
    onCreateFlag({ studentId, reason, priority })
    setReason('')
    setPriority('MEDIUM')
    setShowForm(false)
  }

  return (
    <SectionFrame label="Flags">
      <div className="flex flex-col gap-3">
        {flags.length > 0 ? (
          flags.map((flag) => (
            <GlassContainer key={flag.id} className="space-y-2 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <LuFlag size={14} className={priorityColor(flag.priority)} />
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider ${priorityColor(flag.priority)}`}
                  >
                    {flag.priority}
                  </span>
                  {flag.resolved && (
                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-300">
                      Resolved
                    </span>
                  )}
                </div>
                {!flag.resolved && (
                  <button
                    onClick={() => onResolveFlag(flag.id)}
                    disabled={isResolving}
                    className="flex items-center gap-1 rounded-lg bg-emerald-500/15 px-2.5 py-1 text-xs text-emerald-300 transition-colors hover:bg-emerald-500/25 disabled:opacity-50"
                  >
                    <LuCheckCircle size={12} />
                    Resolve
                  </button>
                )}
              </div>
              <p className="text-sm text-white/80">{flag.reason}</p>
              <p className="text-xs text-white/35">
                By {flag.instructorFirstName} {flag.instructorLastName} ·{' '}
                {formatDate(flag.createdAt)}
              </p>
            </GlassContainer>
          ))
        ) : (
          <p className="text-sm text-white/35">No flags on record.</p>
        )}

        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="flex w-fit items-center gap-2 rounded-xl border border-dashed border-white/15 px-4 py-2.5 text-sm text-white/45 transition-colors hover:border-white/30 hover:text-white/70"
          >
            <LuFlag size={14} />
            Flag this student
          </button>
        ) : (
          <GlassContainer className="space-y-3 p-4">
            <p className="text-sm font-medium text-white">New Flag</p>
            <textarea
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/20"
              placeholder="Describe the concern…"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'LOW' | 'MEDIUM' | 'HIGH')}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
              <button
                disabled={!reason.trim() || isCreating}
                onClick={handleSubmit}
                className="rounded-xl bg-red-500/20 px-4 py-2 text-sm text-red-300 transition-colors hover:bg-red-500/30 disabled:opacity-50"
              >
                {isCreating ? 'Submitting…' : 'Submit Flag'}
              </button>
              <button
                onClick={() => {
                  setShowForm(false)
                  setReason('')
                  setPriority('MEDIUM')
                }}
                className="text-sm text-white/35 hover:text-white/60"
              >
                Cancel
              </button>
            </div>
            {createError && (
              <p className="flex items-center gap-1.5 text-xs text-red-400">
                <LuAlertTriangle size={12} />
                {createError.message}
              </p>
            )}
          </GlassContainer>
        )}
      </div>
    </SectionFrame>
  )
}

function priorityColor(priority: string) {
  if (priority === 'HIGH') return 'text-red-400'
  if (priority === 'MEDIUM') return 'text-amber-400'
  return 'text-white/40'
}
