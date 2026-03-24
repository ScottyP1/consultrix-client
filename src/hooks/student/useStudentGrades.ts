import { useQuery } from '@tanstack/react-query'

import { getGrades } from '@/api/consultrix'

export function useStudentGrades() {
  return useQuery({
    queryKey: ['student', 'grades'],
    queryFn: getGrades,
    staleTime: 1000 * 60 * 5,
  })
}
