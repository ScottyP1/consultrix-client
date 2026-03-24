import { useQueries, useMutation, useQueryClient } from '@tanstack/react-query'

import {
  getSubmissionsByAssignment,
  getGradesByAssignment,
  createGrade,
  updateGrade,
  type GradeRequestDto,
} from '@/api/consultrix'
import { useInstructorWorkspaceData } from './useInstructorWorkspaceData'

/**
 * All data + mutations needed for the instructor view of a single assignment.
 * Combines the shared workspace cache with per-assignment queries.
 */
export function useInstructorAssignmentDetail(assignmentId: number) {
  const workspace = useInstructorWorkspaceData()
  const queryClient = useQueryClient()
  const enabled = !Number.isNaN(assignmentId) && assignmentId > 0

  const [submissionsQuery, gradesQuery] = useQueries({
    queries: [
      {
        queryKey: ['instructor', 'assignment-submissions', assignmentId],
        queryFn: () => getSubmissionsByAssignment(assignmentId),
        enabled,
        staleTime: 1000 * 60 * 5,
      },
      {
        queryKey: ['instructor', 'assignment-grades', assignmentId],
        queryFn: () => getGradesByAssignment(assignmentId),
        enabled,
        staleTime: 1000 * 60 * 5,
      },
    ],
  })

  const invalidateGrades = () => {
    queryClient.invalidateQueries({ queryKey: ['instructor', 'assignment-grades', assignmentId] })
    queryClient.invalidateQueries({ queryKey: ['instructor', 'grades'] })
  }

  const createGradeMutation = useMutation({
    mutationFn: (payload: GradeRequestDto) => createGrade(payload),
    onSuccess: invalidateGrades,
  })

  const updateGradeMutation = useMutation({
    mutationFn: ({ gradeId, payload }: { gradeId: number; payload: GradeRequestDto }) =>
      updateGrade(gradeId, payload),
    onSuccess: invalidateGrades,
  })

  const assignment = workspace.isLoading
    ? undefined
    : (workspace.assignmentsQuery.data ?? []).find((a) => a.id === assignmentId)

  return {
    ...workspace,
    assignment,
    submissionsQuery,
    gradesQuery,
    createGradeMutation,
    updateGradeMutation,
  }
}
