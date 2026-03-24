import { useQueries } from '@tanstack/react-query'

import {
  getCohorts,
  getFacilities,
  getInstructors,
  getMe,
  getModules,
  getStudents,
  getAllSubmissions,
  getAssignmentsForInstructor,
  getAdminStats,
} from '@/api/consultrix'

const REF = 1000 * 60 * 30  // 30 min — reference data
const LIVE = 1000 * 60 * 5   // 5 min  — operational data

export function useAdminData() {
  const [
    meQuery,
    facilitiesQuery,
    cohortsQuery,
    studentsQuery,
    instructorsQuery,
    modulesQuery,
    assignmentsQuery,
    submissionsQuery,
    statsQuery,
  ] = useQueries({
    queries: [
      { queryKey: ['auth', 'me'], queryFn: getMe, staleTime: Infinity },
      { queryKey: ['admin', 'facilities'], queryFn: getFacilities, staleTime: REF },
      { queryKey: ['admin', 'cohorts'], queryFn: getCohorts, staleTime: REF },
      { queryKey: ['admin', 'students'], queryFn: getStudents, staleTime: REF },
      { queryKey: ['admin', 'instructors'], queryFn: getInstructors, staleTime: REF },
      { queryKey: ['admin', 'modules'], queryFn: getModules, staleTime: REF },
      { queryKey: ['admin', 'assignments'], queryFn: getAssignmentsForInstructor, staleTime: REF },
      { queryKey: ['admin', 'submissions'], queryFn: getAllSubmissions, staleTime: LIVE },
      { queryKey: ['admin', 'stats'], queryFn: getAdminStats, staleTime: LIVE },
    ],
  })

  const queries = [
    meQuery, facilitiesQuery, cohortsQuery, studentsQuery,
    instructorsQuery, modulesQuery, assignmentsQuery, submissionsQuery, statsQuery,
  ]

  return {
    meQuery,
    facilitiesQuery,
    cohortsQuery,
    studentsQuery,
    instructorsQuery,
    modulesQuery,
    assignmentsQuery,
    submissionsQuery,
    statsQuery,
    isLoading: queries.some((q) => q.isLoading),
    error:
      meQuery.error ?? facilitiesQuery.error ?? cohortsQuery.error ??
      studentsQuery.error ?? instructorsQuery.error ?? modulesQuery.error ??
      assignmentsQuery.error ?? submissionsQuery.error ?? statsQuery.error ?? null,
  }
}
