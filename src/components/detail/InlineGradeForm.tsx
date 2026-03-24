import { useState } from 'react'
import { LuAlertTriangle } from 'react-icons/lu'

interface InlineGradeFormProps {
  maxScore: number
  existingGrade?: { id: number; score: number; feedback?: string | null }
  onSave: (params: { gradeId?: number; score: number; feedback: string }) => void
  onCancel: () => void
  isPending: boolean
  error?: Error | null
}

/**
 * Inline score + feedback form used inside the instructor assignment detail.
 * Handles both create-new and edit-existing flows.
 */
export default function InlineGradeForm({
  maxScore,
  existingGrade,
  onSave,
  onCancel,
  isPending,
  error,
}: InlineGradeFormProps) {
  const [score, setScore] = useState(
    existingGrade !== undefined ? String(existingGrade.score) : '',
  )
  const [feedback, setFeedback] = useState(existingGrade?.feedback ?? '')

  function handleSave() {
    const parsed = parseFloat(score)
    if (Number.isNaN(parsed)) return
    onSave({ gradeId: existingGrade?.id, score: parsed, feedback })
  }

  return (
    <div className="border-t border-white/8 pt-3 space-y-2">
      <div className="flex flex-wrap gap-3">
        <input
          type="number"
          min={0}
          max={maxScore}
          placeholder={`Score (max ${maxScore})`}
          value={score}
          onChange={(e) => setScore(e.target.value)}
          className="w-40 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/20"
        />
        <input
          type="text"
          placeholder="Feedback (optional)"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/20"
        />
        <button
          disabled={!score || isPending}
          onClick={handleSave}
          className="rounded-xl bg-sky-500/20 px-4 py-2 text-sm text-sky-300 transition-colors hover:bg-sky-500/30 disabled:opacity-50"
        >
          {isPending ? 'Saving…' : existingGrade ? 'Update Grade' : 'Save Grade'}
        </button>
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-400">
          <LuAlertTriangle size={12} />
          {error.message}
        </p>
      )}
    </div>
  )
}
