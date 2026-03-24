import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { getCalendarEvents, type CalendarEventDto } from '@/api/consultrix'
import { useStudentProfile } from './useStudentProfile'
import { useStompClient } from '../useStompClient'

export function useStudentCalendarEvents() {
  const profileQuery = useStudentProfile()
  const cohortId = profileQuery.data?.cohortId
  const { connected, subscribe } = useStompClient()
  const [liveEvents, setLiveEvents] = useState<CalendarEventDto[]>([])

  const serverEventsQuery = useQuery({
    queryKey: ['calendar-events'],
    queryFn: getCalendarEvents,
    enabled: !!profileQuery.data,
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    if (!connected || !cohortId) return

    const sub1 = subscribe(`/topic/calendar.cohort.${cohortId}`, (msg) => {
      const event: CalendarEventDto = JSON.parse(msg.body)
      setLiveEvents((prev) => [...prev.filter((e) => e.id !== event.id), event])
    })
    const sub2 = subscribe('/topic/calendar.all', (msg) => {
      const event: CalendarEventDto = JSON.parse(msg.body)
      setLiveEvents((prev) => [...prev.filter((e) => e.id !== event.id), event])
    })

    return () => {
      sub1?.unsubscribe()
      sub2?.unsubscribe()
    }
  }, [connected, cohortId, subscribe])

  return { serverEventsQuery, liveEvents }
}
