import { useQuery } from '@tanstack/react-query'

import { getSubmissionsByStudent } from '@/api/consultrix'

export function useStudentSubmissions(studentUserId?: number) {
  return useQuery({
    queryKey: ['student', 'submissions', studentUserId],
    queryFn: () => getSubmissionsByStudent(studentUserId as number),
    enabled: studentUserId != null,
  })
}
