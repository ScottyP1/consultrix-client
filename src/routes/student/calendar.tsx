import { useMemo, useState, type ReactNode } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'

import GlassContainer from '#/components/liquidGlass/GlassContainer'
import PageHeader from '#/components/PageHeader'
import { useStudentAssignments } from '#/hooks/student/useStudentAssignments'

type CalendarEventType = 'assignment' | 'exam' | 'event'

type CalendarEvent = {
  id: string
  title: string
  description: string
  date: Date
  type: CalendarEventType
}

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const eventTypeMeta: Record<
  CalendarEventType,
  {
    chipClassName: string
    markerClassName: string
    label: string
  }
> = {
  assignment: {
    chipClassName: 'bg-rose-500/18 text-rose-300',
    markerClassName: 'bg-rose-400',
    label: 'Assignments',
  },
  exam: {
    chipClassName: 'bg-violet-500/18 text-violet-300',
    markerClassName: 'bg-violet-400',
    label: 'Exams',
  },
  event: {
    chipClassName: 'bg-sky-500/18 text-sky-300',
    markerClassName: 'bg-sky-400',
    label: 'Events',
  },
}

export const Route = createFileRoute('/student/calendar')({
  component: RouteComponent,
})

function RouteComponent() {
  const assignmentsQuery = useStudentAssignments()
  const events = useMemo<CalendarEvent[]>(() => {
    return (assignmentsQuery.data ?? [])
      .map((assignment) => {
        const date = getEventDate(assignment.dueDate, assignment.dueTime)

        if (!date) {
          return null
        }

        return {
          id: String(assignment.assignmentId),
          title: assignment.title,
          description: assignment.description || assignment.moduleTitle,
          date,
          type: inferEventType(assignment.title, assignment.moduleTitle),
        }
      })
      .filter((event): event is CalendarEvent => event !== null)
      .sort((left, right) => left.date.getTime() - right.date.getTime())
  }, [assignmentsQuery.data])
  const [visibleMonth, setVisibleMonth] = useState<Date>(() => {
    const anchor = events[0] ?? null

    return anchor
      ? new Date(anchor.date.getFullYear(), anchor.date.getMonth(), 1)
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  })

  const monthDays = useMemo(() => buildMonthGrid(visibleMonth), [visibleMonth])
  const eventsByDay = useMemo(() => {
    const lookup = new Map<string, CalendarEvent[]>()

    events.forEach((event) => {
      const key = toDateKey(event.date)
      const current = lookup.get(key) ?? []
      current.push(event)
      lookup.set(key, current)
    })

    return lookup
  }, [events])
  const upcomingEvents = useMemo(() => {
    const now = Date.now()

    return events
      .filter((event) => event.date.getTime() >= now)
      .slice(0, 5)
  }, [events])

  if (assignmentsQuery.isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="Calendar"
          title="Loading calendar"
          subtitle="Fetching your coursework schedule."
        />
      </div>
    )
  }

  if (assignmentsQuery.error) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="Calendar"
          title="Calendar unavailable"
          subtitle={assignmentsQuery.error.message}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Calendar"
        title="Calendar"
        subtitle="Track deadlines, events, and exams."
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <GlassContainer className="rounded-[18px] p-4 md:p-5">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-white">
                {new Intl.DateTimeFormat('en-US', {
                  month: 'long',
                  year: 'numeric',
                }).format(visibleMonth)}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <MonthNavButton
                onClick={() =>
                  setVisibleMonth(
                    (current) =>
                      new Date(
                        current.getFullYear(),
                        current.getMonth() - 1,
                        1,
                      ),
                  )
                }
                label="Previous month"
              >
                <LuChevronLeft size={18} />
              </MonthNavButton>
              <MonthNavButton
                onClick={() =>
                  setVisibleMonth(
                    (current) =>
                      new Date(
                        current.getFullYear(),
                        current.getMonth() + 1,
                        1,
                      ),
                  )
                }
                label="Next month"
              >
                <LuChevronRight size={18} />
              </MonthNavButton>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 px-1 pb-2">
            {dayLabels.map((label) => (
              <div
                key={label}
                className="pb-2 text-center text-xs font-medium uppercase tracking-[0.18em] text-white/35"
              >
                {label}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {monthDays.map((day) => {
              const dayEvents = eventsByDay.get(toDateKey(day.date)) ?? []
              const isToday = isSameDay(day.date, new Date())
              const isVisibleMonth =
                day.date.getMonth() === visibleMonth.getMonth() &&
                day.date.getFullYear() === visibleMonth.getFullYear()

              return (
                <div
                  key={toDateKey(day.date)}
                  className={`min-h-28 rounded-2xl border p-3 transition md:min-h-36 ${
                    isToday
                      ? 'border-indigo-400/60 bg-indigo-500/16 shadow-[inset_0_0_0_1px_rgba(129,140,248,0.35)]'
                      : isVisibleMonth
                        ? 'border-white/8 bg-white/4'
                        : 'border-white/5 bg-white/[0.025]'
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span
                      className={`text-sm font-medium ${
                        isVisibleMonth ? 'text-white/85' : 'text-white/20'
                      }`}
                    >
                      {day.date.getDate()}
                    </span>
                    {dayEvents.length > 0 ? (
                      <span className="text-[10px] uppercase tracking-[0.18em] text-white/30">
                        {dayEvents.length}
                      </span>
                    ) : null}
                  </div>

                  <div className="space-y-1.5">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className={`truncate rounded-md px-2 py-1 text-[11px] font-medium ${eventTypeMeta[event.type].chipClassName}`}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </GlassContainer>

        <div className="space-y-4">
          <GlassContainer className="rounded-[18px] p-4">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Upcoming Events
            </h3>

            {upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-2xl border border-white/8 bg-white/5 p-4"
                  >
                    <p className="text-sm font-semibold text-white">
                      {event.title}
                    </p>
                    <p className="mt-1 text-xs text-white/45">
                      {formatEventDate(event.date)}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <span
                        className={`rounded-md px-2 py-1 text-[10px] uppercase tracking-[0.18em] ${eventTypeMeta[event.type].chipClassName}`}
                      >
                        {event.type}
                      </span>
                      <span className="truncate text-xs text-white/35">
                        {event.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/45">No upcoming events.</p>
            )}
          </GlassContainer>

          <GlassContainer className="rounded-[18px] p-4">
            <h3 className="mb-4 text-lg font-semibold text-white">Legend</h3>
            <div className="space-y-3">
              {(
                Object.entries(eventTypeMeta) as Array<
                  [CalendarEventType, (typeof eventTypeMeta)[CalendarEventType]]
                >
              ).map(([type, meta]) => (
                <div key={type} className="flex items-center gap-3 text-sm">
                  <span
                    className={`h-3 w-3 rounded-sm ${meta.markerClassName}`}
                  />
                  <span className="text-white/70">{meta.label}</span>
                </div>
              ))}
            </div>
          </GlassContainer>
        </div>
      </div>
    </div>
  )
}

function MonthNavButton({
  children,
  label,
  onClick,
}: {
  children: ReactNode
  label: string
  onClick: () => void
}) {
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
  const start = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth(),
    1,
  )
  const end = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth() + 1,
    0,
  )
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

function inferEventType(title: string, moduleTitle: string): CalendarEventType {
  const value = `${title} ${moduleTitle}`.toLowerCase()

  if (
    value.includes('quiz') ||
    value.includes('exam') ||
    value.includes('test') ||
    value.includes('assessment')
  ) {
    return 'exam'
  }

  if (
    value.includes('workshop') ||
    value.includes('fair') ||
    value.includes('interview') ||
    value.includes('orientation')
  ) {
    return 'event'
  }

  return 'assignment'
}

function getEventDate(dueDate?: string | null, dueTime?: string | null) {
  const value =
    dueDate && dueTime
      ? dueTime.includes('T')
        ? dueTime
        : `${dueDate}T${dueTime}`
      : dueDate ?? dueTime ?? ''
  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? null : date
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

function isSameDay(left: Date, right: Date) {
  return toDateKey(left) === toDateKey(right)
}

function formatEventDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}
