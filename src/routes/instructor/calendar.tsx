import { useMemo, useState, type ReactNode } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { LuChevronLeft, LuChevronRight, LuPlus, LuX, LuUsers, LuTrash2 } from 'react-icons/lu'

import GlassContainer from '#/components/liquidGlass/GlassContainer'
import PageHeader from '#/components/PageHeader'
import { useInstructorWorkspaceData } from '#/hooks/instructor/useInstructorWorkspaceData'
import { useInstructorCalendarEvents } from '#/hooks/instructor/useInstructorCalendarEvents'
import type { CalendarEventDto, CreateCalendarEventPayload } from '@/api/consultrix'

export const Route = createFileRoute('/instructor/calendar')({
  component: RouteComponent,
})

type CalendarEventType = 'class' | 'exam' | 'study_group' | 'event' | 'announcement'

const eventTypeMeta: Record<CalendarEventType, { chipClassName: string; markerClassName: string; label: string }> = {
  class: { chipClassName: 'bg-emerald-500/18 text-emerald-300', markerClassName: 'bg-emerald-400', label: 'Classes' },
  exam: { chipClassName: 'bg-violet-500/18 text-violet-300', markerClassName: 'bg-violet-400', label: 'Exams' },
  study_group: { chipClassName: 'bg-amber-500/18 text-amber-300', markerClassName: 'bg-amber-400', label: 'Study Groups' },
  event: { chipClassName: 'bg-sky-500/18 text-sky-300', markerClassName: 'bg-sky-400', label: 'Events' },
  announcement: { chipClassName: 'bg-rose-500/18 text-rose-300', markerClassName: 'bg-rose-400', label: 'Announcements' },
}

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function RouteComponent() {
  const { meQuery } = useInstructorWorkspaceData()
  const myId = meQuery.data ? Number(meQuery.data.id) : undefined

  const { eventsQuery, cohortsQuery, liveEvents, createMutation, deleteMutation } = useInstructorCalendarEvents()

  const [visibleMonth, setVisibleMonth] = useState<Date>(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  )
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventDto | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  // Create event form state
  const [form, setForm] = useState<{
    title: string
    description: string
    startTime: string
    endTime: string
    eventType: string
    cohortId: string
  }>({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    eventType: 'CLASS',
    cohortId: '',
  })

  const allEvents = useMemo(() => {
    const seen = new Set<number>()
    return [...(eventsQuery.data ?? []), ...liveEvents].filter((e) => {
      if (seen.has(e.id)) return false
      seen.add(e.id)
      return true
    })
  }, [eventsQuery.data, liveEvents])

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEventDto[]>()
    allEvents.forEach((e) => {
      const key = e.startTime.slice(0, 10)
      const list = map.get(key) ?? []
      list.push(e)
      map.set(key, list)
    })
    return map
  }, [allEvents])

  const monthDays = useMemo(() => buildMonthGrid(visibleMonth), [visibleMonth])

  const upcomingEvents = useMemo(() => {
    const now = Date.now()
    return allEvents
      .filter((e) => new Date(e.startTime).getTime() >= now)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .slice(0, 5)
  }, [allEvents])

  function handleCreate() {
    if (!form.title || !form.startTime) return
    const payload: CreateCalendarEventPayload = {
      title: form.title,
      description: form.description || undefined,
      startTime: form.startTime,
      endTime: form.endTime || undefined,
      eventType: form.eventType,
      cohortId: form.cohortId ? Number(form.cohortId) : undefined,
    }
    createMutation.mutate(payload, {
      onSuccess: () => {
        setShowCreate(false)
        setForm({ title: '', description: '', startTime: '', endTime: '', eventType: 'CLASS', cohortId: '' })
      },
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <PageHeader eyebrow="Calendar" title="Calendar" subtitle="Manage class events and announcements." />
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/6 px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white"
        >
          <LuPlus size={15} /> Add Event
        </button>
      </div>

      {/* Create event panel */}
      {showCreate && (
        <GlassContainer className="rounded-[18px] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">New Calendar Event</h3>
            <button type="button" onClick={() => setShowCreate(false)} className="text-white/40 hover:text-white">
              <LuX size={16} />
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Title *"
                className="w-full rounded-xl border border-white/10 bg-white/6 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/30"
              />
            </div>
            <div className="sm:col-span-2">
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Description"
                rows={2}
                className="w-full rounded-xl border border-white/10 bg-white/6 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/30 resize-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-white/50">Start Time *</label>
              <input
                type="datetime-local"
                value={form.startTime}
                onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-white/6 px-3 py-2.5 text-sm text-white outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-white/50">End Time</label>
              <input
                type="datetime-local"
                value={form.endTime}
                onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-white/6 px-3 py-2.5 text-sm text-white outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-white/50">Type</label>
              <select
                value={form.eventType}
                onChange={(e) => setForm((f) => ({ ...f, eventType: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-[#1a1a2e] px-3 py-2.5 text-sm text-white outline-none"
              >
                <option value="CLASS">Class</option>
                <option value="EXAM">Exam</option>
                <option value="STUDY_GROUP">Study Group</option>
                <option value="ANNOUNCEMENT">Announcement</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-white/50">Cohort (leave blank for all)</label>
              <select
                value={form.cohortId}
                onChange={(e) => setForm((f) => ({ ...f, cohortId: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-[#1a1a2e] px-3 py-2.5 text-sm text-white outline-none"
              >
                <option value="">All cohorts</option>
                {(cohortsQuery?.data ?? []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              disabled={!form.title || !form.startTime || createMutation.isPending}
              onClick={handleCreate}
              className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
            >
              {createMutation.isPending ? 'Creating…' : 'Create Event'}
            </button>
            <button type="button" onClick={() => setShowCreate(false)} className="text-xs text-white/40 hover:text-white/60">
              Cancel
            </button>
          </div>
        </GlassContainer>
      )}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
        {/* Calendar grid */}
        <GlassContainer className="rounded-[18px] p-4 md:p-5">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(visibleMonth)}
            </h2>
            <div className="flex items-center gap-2">
              <MonthNavButton
                onClick={() => setVisibleMonth((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))}
                label="Previous month"
              >
                <LuChevronLeft size={18} />
              </MonthNavButton>
              <MonthNavButton
                onClick={() => setVisibleMonth((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))}
                label="Next month"
              >
                <LuChevronRight size={18} />
              </MonthNavButton>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 px-1 pb-2">
            {dayLabels.map((l) => (
              <div key={l} className="pb-2 text-center text-xs font-medium uppercase tracking-[0.18em] text-white/35">
                {l}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {monthDays.map((day) => {
              const key = toDateKey(day.date)
              const dayEvents = eventsByDay.get(key) ?? []
              const isToday = isSameDay(day.date, new Date())
              const isVisible = day.date.getMonth() === visibleMonth.getMonth()

              return (
                <div
                  key={key}
                  className={`min-h-28 rounded-2xl border p-3 md:min-h-36 ${
                    isToday
                      ? 'border-indigo-400/60 bg-indigo-500/16 shadow-[inset_0_0_0_1px_rgba(129,140,248,0.35)]'
                      : isVisible
                        ? 'border-white/8 bg-white/4'
                        : 'border-white/5 bg-white/[0.025]'
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className={`text-sm font-medium ${isVisible ? 'text-white/85' : 'text-white/20'}`}>
                      {day.date.getDate()}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-[10px] uppercase tracking-[0.18em] text-white/30">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    {dayEvents.slice(0, 2).map((e) => {
                      const type = toEventType(e.eventType)
                      return (
                        <button
                          key={e.id}
                          type="button"
                          onClick={() => setSelectedEvent(e)}
                          className={`w-full truncate rounded-md px-2 py-1 text-left text-[11px] font-medium hover:opacity-80 ${eventTypeMeta[type].chipClassName}`}
                        >
                          {e.title}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </GlassContainer>

        {/* Sidebar */}
        <div className="space-y-4">
          <GlassContainer className="rounded-[18px] p-4">
            <h3 className="mb-4 text-lg font-semibold text-white">Upcoming Events</h3>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.map((e) => {
                  const type = toEventType(e.eventType)
                  return (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => setSelectedEvent(e)}
                      className="w-full rounded-2xl border border-white/8 bg-white/5 p-4 text-left hover:bg-white/8 transition"
                    >
                      <p className="text-sm font-semibold text-white">{e.title}</p>
                      <p className="mt-1 text-xs text-white/45">
                        {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(e.startTime))}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`rounded-md px-2 py-1 text-[10px] uppercase tracking-[0.18em] ${eventTypeMeta[type].chipClassName}`}>
                          {type}
                        </span>
                        {e.cohortName && (
                          <span className="truncate text-xs text-white/35">{e.cohortName}</span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-white/45">No upcoming events.</p>
            )}
          </GlassContainer>

          <GlassContainer className="rounded-[18px] p-4">
            <h3 className="mb-4 text-lg font-semibold text-white">Legend</h3>
            <div className="space-y-3">
              {(Object.entries(eventTypeMeta) as [CalendarEventType, typeof eventTypeMeta[CalendarEventType]][]).map(
                ([type, meta]) => (
                  <div key={type} className="flex items-center gap-3 text-sm">
                    <span className={`h-3 w-3 rounded-sm ${meta.markerClassName}`} />
                    <span className="text-white/70">{meta.label}</span>
                  </div>
                ),
              )}
            </div>
          </GlassContainer>
        </div>
      </div>

      {/* Event detail modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="w-full max-w-md rounded-[18px] border border-white/10 bg-white/5 p-6 backdrop-blur-[10px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <span className={`rounded-md px-2 py-1 text-[10px] uppercase tracking-[0.18em] ${eventTypeMeta[toEventType(selectedEvent.eventType)].chipClassName}`}>
                {selectedEvent.eventType}
              </span>
              <button type="button" onClick={() => setSelectedEvent(null)} className="text-white/40 hover:text-white">
                <LuX size={18} />
              </button>
            </div>
            <h2 className="text-xl font-semibold text-white">{selectedEvent.title}</h2>
            <p className="mt-1 text-sm text-white/50">
              {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(selectedEvent.startTime))}
            </p>
            {selectedEvent.description && (
              <p className="mt-3 text-sm leading-6 text-white/70">{selectedEvent.description}</p>
            )}
            {selectedEvent.cohortName && (
              <p className="mt-2 text-xs text-white/40">Cohort: {selectedEvent.cohortName}</p>
            )}
            {selectedEvent.conversation && (
              <div className="mt-4 rounded-xl border border-white/8 bg-white/5 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-white/80">
                  <LuUsers size={14} /> Attendees
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedEvent.conversation.members.map((m) => (
                    <span key={m.id} className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-white/70">
                      {m.firstName} {m.lastName}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {selectedEvent.createdBy?.id === myId && (
              <button
                type="button"
                onClick={() => deleteMutation.mutate(selectedEvent.id, { onSuccess: () => setSelectedEvent(null) })}
                disabled={deleteMutation.isPending}
                className="mt-4 flex items-center gap-2 text-xs text-rose-400/70 hover:text-rose-400 disabled:opacity-40"
              >
                <LuTrash2 size={13} /> Delete Event
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function MonthNavButton({ children, label, onClick }: { children: ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 bg-white/6 text-white/65 transition hover:border-white/16 hover:bg-white/10 hover:text-white"
    >
      {children}
    </button>
  )
}

function buildMonthGrid(visibleMonth: Date) {
  const start = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1)
  const end = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0)
  const gridStart = new Date(start)
  gridStart.setDate(start.getDate() - start.getDay())
  const gridEnd = new Date(end)
  gridEnd.setDate(end.getDate() + (6 - end.getDay()))
  const days: { date: Date }[] = []
  const cursor = new Date(gridStart)
  while (cursor <= gridEnd) {
    days.push({ date: new Date(cursor) })
    cursor.setDate(cursor.getDate() + 1)
  }
  return days
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

function isSameDay(a: Date, b: Date) {
  return toDateKey(a) === toDateKey(b)
}

function toEventType(serverType: string): CalendarEventType {
  switch (serverType?.toUpperCase()) {
    case 'CLASS': return 'class'
    case 'EXAM': return 'exam'
    case 'STUDY_GROUP': return 'study_group'
    case 'ANNOUNCEMENT': return 'announcement'
    default: return 'event'
  }
}
