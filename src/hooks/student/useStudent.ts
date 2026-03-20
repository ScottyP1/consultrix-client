import { useQuery } from '@tanstack/react-query'
import { getStudent } from '#/api/student/getStudent.api'

type UseStudentOptions = {
  enabled?: boolean
}

export const useStudent = ({ enabled = true }: UseStudentOptions = {}) => {
  return useQuery({
    queryKey: ['student'],
    queryFn: () => getStudent(),
    enabled,
  })
}
