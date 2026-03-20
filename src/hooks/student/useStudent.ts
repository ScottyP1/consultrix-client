import { useStudentProfile } from './useStudentProfile'

type UseStudentOptions = {
  enabled?: boolean
}

export const useStudent = ({ enabled = true }: UseStudentOptions = {}) =>
  useStudentProfile({
    enabled,
  })
