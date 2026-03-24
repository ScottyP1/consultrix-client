import { useQuery } from '@tanstack/react-query'

import { getStudentsByCohort } from '@/api/consultrix'

export function useStudentContacts(cohortId: number | undefined) {
  return useQuery({
    queryKey: ['student', 'contacts', cohortId],
    queryFn: () => getStudentsByCohort(cohortId!),
    enabled: cohortId != null,
    staleTime: 1000 * 60 * 30,
  })
}
