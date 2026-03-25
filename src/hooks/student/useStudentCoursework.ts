import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { getStudentCoursework, createSubmission, type SubmissionRequestDto } from '@/api/consultrix'

export function useStudentCoursework() {
  const qc = useQueryClient()

  const courseworkQuery = useQuery({
    queryKey: ['student', 'coursework'],
    queryFn: getStudentCoursework,
    staleTime: 1000 * 60 * 5,
  })

  const submitMutation = useMutation({
    mutationFn: (payload: SubmissionRequestDto) => createSubmission(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['student', 'coursework'] })
      qc.invalidateQueries({ queryKey: ['student', 'assignments'] })
    },
  })

  return { courseworkQuery, submitMutation }
}
