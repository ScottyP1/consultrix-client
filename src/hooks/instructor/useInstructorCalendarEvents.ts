import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import {
  getCalendarEvents,
  createCalendarEvent,
  deleteCalendarEvent,
  getCohorts,
  type CalendarEventDto,
  type CreateCalendarEventPayload,
} from '@/api/consultrix'
import { useStompClient } from '../useStompClient'

export function useInstructorCalendarEvents() {
  const qc = useQueryClient()
  const { connected, subscribe } = useStompClient()
  const [liveEvents, setLiveEvents] = useState<CalendarEventDto[]>([])

  const eventsQuery = useQuery({
    queryKey: ['instructor-calendar-events'],
    queryFn: getCalendarEvents,
    staleTime: 1000 * 60 * 5,
  })

  const cohortsQuery = useQuery({
    queryKey: ['cohorts'],
    queryFn: getCohorts,
    staleTime: 1000 * 60 * 30,
  })

  useEffect(() => {
    if (!connected) return
    const sub = subscribe('/topic/calendar.all', (msg) => {
      const event: CalendarEventDto = JSON.parse(msg.body)
      setLiveEvents((prev) => [...prev.filter((e) => e.id !== event.id), event])
      qc.invalidateQueries({ queryKey: ['instructor-calendar-events'] })
    })
    return () => { sub?.unsubscribe() }
  }, [connected, subscribe, qc])

  const createMutation = useMutation({
    mutationFn: (payload: CreateCalendarEventPayload) => createCalendarEvent(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['instructor-calendar-events'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (eventId: number) => deleteCalendarEvent(eventId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['instructor-calendar-events'] }),
  })

  return { eventsQuery, cohortsQuery, liveEvents, createMutation, deleteMutation }
}
