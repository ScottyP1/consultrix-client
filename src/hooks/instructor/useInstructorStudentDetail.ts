import { useQueries, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import {
  getAttendanceByStudent,
  getGradesByStudent,
  getSubmissionsByStudent,
  getFlagsForStudent,
  createFlag,
  resolveFlag,
  type StudentFlagRequestDto,
} from '@/api/consultrix'
import { useInstructorWorkspaceData } from './useInstructorWorkspaceData'

/**
 * All data + mutations needed for the instructor view of a single student.
 * Combines the shared workspace cache with per-student queries.
 */
export function useInstructorStudentDetail(studentId: number) {
  const workspace = useInstructorWorkspaceData()
  const queryClient = useQueryClient()
  const enabled = !Number.isNaN(studentId) && studentId > 0

  const [gradesQuery, submissionsQuery, attendanceQuery] = useQueries({
    queries: [
      {
        queryKey: ['instructor', 'student-grades', studentId],
        queryFn: () => getGradesByStudent(studentId),
        enabled,
      },
      {
        queryKey: ['instructor', 'student-submissions', studentId],
        queryFn: () => getSubmissionsByStudent(studentId),
        enabled,
      },
      {
        queryKey: ['instructor', 'student-attendance', studentId],
        queryFn: () => getAttendanceByStudent(studentId),
        enabled,
      },
    ],
  })

  const flagsQuery = useQuery({
    queryKey: ['instructor', 'student-flags', studentId],
    queryFn: () => getFlagsForStudent(studentId),
    enabled,
  })

  const invalidateFlags = () => {
    queryClient.invalidateQueries({ queryKey: ['instructor', 'student-flags', studentId] })
    queryClient.invalidateQueries({ queryKey: ['instructor', 'my-flags'] })
  }

  const createFlagMutation = useMutation({
    mutationFn: (payload: StudentFlagRequestDto) => createFlag(payload),
    onSuccess: invalidateFlags,
  })

  const resolveFlagMutation = useMutation({
    mutationFn: (flagId: number) => resolveFlag(flagId),
    onSuccess: invalidateFlags,
  })

  const student = workspace.isLoading
    ? undefined
    : (workspace.studentsQuery.data ?? []).find((s) => s.id === studentId)

  return {
    ...workspace,
    student,
    gradesQuery,
    submissionsQuery,
    attendanceQuery,
    flagsQuery,
    createFlagMutation,
    resolveFlagMutation,
  }
}
