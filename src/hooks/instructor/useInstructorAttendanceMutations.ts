import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createAttendance, updateAttendance, type AttendanceRequestDto } from '@/api/consultrix'

export function useInstructorAttendanceMutations() {
  const qc = useQueryClient()

  const createAttendanceMutation = useMutation({
    mutationFn: (payload: AttendanceRequestDto) => createAttendance(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['instructor', 'attendance'] }),
  })

  const updateAttendanceMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AttendanceRequestDto }) =>
      updateAttendance(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['instructor', 'attendance'] }),
  })

  return { createAttendanceMutation, updateAttendanceMutation }
}
