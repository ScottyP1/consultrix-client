import { useQuery } from '@tanstack/react-query'

import { getStudentProfile } from '@/api/consultrix'

type UseStudentProfileOptions = {
  enabled?: boolean
}

export function useStudentProfile({
  enabled = true,
}: UseStudentProfileOptions = {}) {
  return useQuery({
    queryKey: ['student', 'profile'],
    queryFn: getStudentProfile,
    enabled,
    staleTime: Infinity,
  })
}
