import { useQuery } from '@tanstack/react-query'

import { getStudentCoursework } from '@/api/consultrix'

export function useStudentAssignments() {
  return useQuery({
    queryKey: ['student', 'assignments'],
    queryFn: getStudentCoursework,
    staleTime: 1000 * 60 * 5,
  })
}
