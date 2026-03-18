import { useQuery } from '@tanstack/react-query'
import { getStudent } from '#/api/student/getStudent.api'

export const useMe = () => {
  useQuery({
    queryKey: ['me'],
    queryFn: getStudent(),
  })
}
