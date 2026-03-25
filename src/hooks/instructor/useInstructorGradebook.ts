import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import {
  getMyFlags,
  createFlag,
  resolveFlag,
  createGrade,
  updateGrade,
  type GradeRequestDto,
  type StudentFlagRequestDto,
} from '@/api/consultrix'

export function useInstructorGradebook() {
  const qc = useQueryClient()

  const myFlagsQuery = useQuery({
    queryKey: ['instructor', 'my-flags'],
    queryFn: getMyFlags,
    staleTime: 1000 * 60,
  })

  const createFlagMutation = useMutation({
    mutationFn: (payload: StudentFlagRequestDto) => createFlag(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['instructor', 'my-flags'] }),
  })

  const resolveFlagMutation = useMutation({
    mutationFn: (id: number) => resolveFlag(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['instructor', 'my-flags'] }),
  })

  const invalidateGrades = () => {
    qc.invalidateQueries({ queryKey: ['instructor', 'grades'] })
    qc.invalidateQueries({ queryKey: ['instructor', 'submissions'] })
  }

  const createGradeMutation = useMutation({
    mutationFn: (payload: GradeRequestDto) => createGrade(payload),
    onSettled: invalidateGrades,
  })

  const updateGradeMutation = useMutation({
    mutationFn: ({ gradeId, payload }: { gradeId: number; payload: GradeRequestDto }) =>
      updateGrade(gradeId, payload),
    onSettled: invalidateGrades,
  })

  return {
    myFlagsQuery,
    createFlagMutation,
    resolveFlagMutation,
    createGradeMutation,
    updateGradeMutation,
  }
}
