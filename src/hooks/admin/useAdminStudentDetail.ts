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
import { useAdminData } from './useAdminData'

/**
 * All data + mutations needed for the admin view of a single student.
 * Combines the shared admin cache with per-student queries.
 */
export function useAdminStudentDetail(studentId: number) {
  const admin = useAdminData()
  const queryClient = useQueryClient()
  const enabled = !Number.isNaN(studentId) && studentId > 0

  const [gradesQuery, submissionsQuery, attendanceQuery] = useQueries({
    queries: [
      {
        queryKey: ['admin', 'student-grades', studentId],
        queryFn: () => getGradesByStudent(studentId),
        enabled,
      },
      {
        queryKey: ['admin', 'student-submissions', studentId],
        queryFn: () => getSubmissionsByStudent(studentId),
        enabled,
      },
      {
        queryKey: ['admin', 'student-attendance', studentId],
        queryFn: () => getAttendanceByStudent(studentId),
        enabled,
      },
    ],
  })

  const flagsQuery = useQuery({
    queryKey: ['admin', 'student-flags', studentId],
    queryFn: () => getFlagsForStudent(studentId),
    enabled,
  })

  const invalidateFlags = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'student-flags', studentId] })
  }

  const createFlagMutation = useMutation({
    mutationFn: (payload: StudentFlagRequestDto) => createFlag(payload),
    onSuccess: invalidateFlags,
  })

  const resolveFlagMutation = useMutation({
    mutationFn: (flagId: number) => resolveFlag(flagId),
    onSuccess: invalidateFlags,
  })

  const student = admin.isLoading
    ? undefined
    : (admin.studentsQuery.data ?? []).find((s) => s.id === studentId)

  return {
    ...admin,
    student,
    gradesQuery,
    submissionsQuery,
    attendanceQuery,
    flagsQuery,
    createFlagMutation,
    resolveFlagMutation,
  }
}
