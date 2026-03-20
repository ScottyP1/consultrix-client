import { useQuery } from '@tanstack/react-query'

import { getAttendance } from '@/api/consultrix'

export function useStudentAttendance() {
  return useQuery({
    queryKey: ['student', 'attendance'],
    queryFn: getAttendance,
  })
}
