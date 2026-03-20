import { useQuery } from '@tanstack/react-query'

import { getNotifications, getUnreadNotifications } from '@/api/consultrix'

export function useStudentNotifications(userId?: number) {
  return useQuery({
    queryKey: ['student', 'notifications', userId],
    queryFn: () => getNotifications(userId as number),
    enabled: userId != null,
  })
}

export function useUnreadNotifications(userId?: number) {
  return useQuery({
    queryKey: ['student', 'notifications', 'unread', userId],
    queryFn: () => getUnreadNotifications(userId as number),
    enabled: userId != null,
  })
}
