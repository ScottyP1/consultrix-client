import { useQuery } from '@tanstack/react-query'
import { getStudent } from '#/api/student/getStudent.api'

type UseMeOptions = {
  enabled?: boolean
}

export const useMe = ({ enabled = true }: UseMeOptions = {}) => {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => getStudent(),
    enabled,
  })
}
