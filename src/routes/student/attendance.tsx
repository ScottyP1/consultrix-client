import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { LuCalendarDays, LuTrash2, LuPlus, LuCircleCheck, LuClock, LuWifi, LuX } from 'react-icons/lu'

import PageHeader from '#/components/PageHeader'
import GlassContainer from '#/components/liquidGlass/GlassContainer'
import SectionFrame from '#/components/dashboard/SectionFrame'
import {
  getMyAttendanceRecords,
  getMyPlannedEvents,
  upsertPlannedEvent,
  deletePlannedEvent,
  type PlannedStudentEventRequestDto,
} from '#/api/consultrix'
import { useStudentAttendance } from '#/hooks/student/useStudentAttendance'
import { formatDate, formatStatusLabel } from '#/lib/consultrix-format'

export const Route = createFileRoute('/student/attendance')({
  component: RouteComponent,
})

const EVENT_TYPES = [
  { value: 'LATE' as const, label: 'Running Late', icon: LuClock, color: 'text-amber-400', bg: 'bg-amber-500/15' },
  { value: 'REMOTE' as const, label: 'Remote / WFH', icon: LuWifi, color: 'text-sky-400', bg: 'bg-sky-500/15' },
  { value: 'OFF' as const, label: 'Day Off', icon: LuX, color: 'text-rose-400', bg: 'bg-rose-500/15' },
]

function statusConfig(status: string) {
  const s = status.toUpperCase()
  if (s === 'PRESENT') return { label: 'Present', className: 'bg-emerald-500/15 text-emerald-300' }
  if (s === 'LATE') return { label: 'Late', className: 'bg-amber-500/15 text-amber-300' }
  if (s === 'ABSENT') return { label: 'Absent', className: 'bg-rose-500/15 text-rose-300' }
  if (s === 'EXCUSED') return { label: 'Excused', className: 'bg-violet-500/15 text-violet-300' }
  return { label: formatStatusLabel(status), className: 'bg-white/8 text-white/50' }
}

function RouteComponent() {
  const qc = useQueryClient()
  const attendanceRateQuery = useStudentAttendance()

  const recordsQuery = useQuery({
    queryKey: ['student', 'attendance', 'records'],
    queryFn: getMyAttendanceRecords,
    staleTime: 1000 * 60 * 2,
  })

  const plannedQuery = useQuery({
    queryKey: ['student', 'planned-events'],
    queryFn: getMyPlannedEvents,
    staleTime: 1000 * 60 * 2,
  })

  const upsertMutation = useMutation({
    mutationFn: (payload: PlannedStudentEventRequestDto) => upsertPlannedEvent(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['student', 'planned-events'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deletePlannedEvent(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['student', 'planned-events'] }),
  })

  const [showForm, setShowForm] = useState(false)
  const [formDate, setFormDate] = useState('')
  const [formType, setFormType] = useState<'LATE' | 'REMOTE' | 'OFF'>('LATE')
  const [formNote, setFormNote] = useState('')

  const today = new Date().toISOString().slice(0, 10)

  function handleSubmit() {
    if (!formDate) return
    upsertMutation.mutate(
      { eventDate: formDate, eventType: formType, note: formNote || undefined },
      {
        onSuccess: () => {
          setShowForm(false)
          setFormDate('')
          setFormNote('')
          setFormType('LATE')
        },
      },
    )
  }

  const records = (recordsQuery.data ?? []).slice().sort(
    (a, b) => new Date(b.attendanceDate as unknown as string).getTime() -
              new Date(a.attendanceDate as unknown as string).getTime(),
  )

  const plannedEvents = (plannedQuery.data ?? []).filter(
    (e) => e.eventDate >= today,
  ).sort((a, b) => a.eventDate.localeCompare(b.eventDate))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Attendance"
        title="My Attendance"
        subtitle="View your attendance history and plan upcoming availability."
      />

      {/* Rate card */}
      <GlassContainer className="flex items-center gap-6 p-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15">
          <LuCircleCheck size={24} className="text-emerald-400" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">Overall Attendance Rate</p>
          <p className="text-3xl font-bold text-white">
            {attendanceRateQuery.data?.attendanceRate != null
              ? `${Math.round(attendanceRateQuery.data.attendanceRate)}%`
              : '--'}
          </p>
        </div>
      </GlassContainer>

      {/* Planned events */}
      <SectionFrame label="Planned Availability">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs text-white/40">
            Let your instructor know about upcoming schedule changes.
          </p>
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-1.5 rounded-xl bg-sky-500/15 px-3 py-1.5 text-xs font-medium text-sky-300 transition-colors hover:bg-sky-500/25"
          >
            <LuPlus size={13} />
            Mark a Day
          </button>
        </div>

        {showForm && (
          <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-[11px] uppercase tracking-[0.2em] text-white/40">Date</span>
                <input
                  type="date"
                  min={today}
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none scheme-dark"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-[11px] uppercase tracking-[0.2em] text-white/40">Type</span>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as typeof formType)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                >
                  {EVENT_TYPES.map((t) => (
                    <option key={t.value} value={t.value} className="bg-slate-950">
                      {t.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="space-y-1.5">
              <span className="text-[11px] uppercase tracking-[0.2em] text-white/40">Note (optional)</span>
              <input
                type="text"
                value={formNote}
                onChange={(e) => setFormNote(e.target.value)}
                placeholder="e.g. Doctor appointment in the morning"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/25 outline-none"
              />
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={!formDate || upsertMutation.isPending}
                onClick={handleSubmit}
                className="rounded-xl bg-sky-500/20 px-4 py-2 text-sm font-medium text-sky-300 transition-colors hover:bg-sky-500/30 disabled:opacity-40"
              >
                {upsertMutation.isPending ? 'Saving…' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-xs text-white/40 hover:text-white/60"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {plannedEvents.length === 0 ? (
          <p className="py-2 text-sm text-white/35">No upcoming planned events.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {plannedEvents.map((event) => {
              const type = EVENT_TYPES.find((t) => t.value === event.eventType)
              const Icon = type?.icon ?? LuCalendarDays
              return (
                <div
                  key={event.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-white/8 bg-white/4 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${type?.bg ?? 'bg-white/8'}`}>
                      <Icon size={14} className={type?.color ?? 'text-white/50'} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {formatDate(event.eventDate)} · {type?.label ?? event.eventType}
                      </p>
                      {event.note && (
                        <p className="text-xs text-white/40">{event.note}</p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate(event.id)}
                    disabled={deleteMutation.isPending}
                    className="shrink-0 text-white/25 transition-colors hover:text-rose-400"
                  >
                    <LuTrash2 size={14} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </SectionFrame>

      {/* Attendance history */}
      <SectionFrame label={`Attendance History (${records.length})`}>
        {recordsQuery.isLoading ? (
          <p className="text-sm text-white/40">Loading records…</p>
        ) : records.length === 0 ? (
          <p className="text-sm text-white/35">No attendance records yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {records.map((record) => {
              const cfg = statusConfig(record.status)
              return (
                <div
                  key={record.attendanceId}
                  className="flex items-center justify-between gap-4 rounded-xl border border-white/8 bg-white/4 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <LuCalendarDays size={15} className="shrink-0 text-white/35" />
                    <p className="text-sm text-white">
                      {formatDate(record.attendanceDate as unknown as string)}
                    </p>
                    {record.note && (
                      <p className="text-xs text-white/40">— {record.note}</p>
                    )}
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs ${cfg.className}`}>
                    {cfg.label}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </SectionFrame>
    </div>
  )
}
