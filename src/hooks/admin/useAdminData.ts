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
      { queryKey: ['auth', 'me'], queryFn: getMe },
      { queryKey: ['admin', 'facilities'], queryFn: getFacilities },
      { queryKey: ['admin', 'cohorts'], queryFn: getCohorts },
      { queryKey: ['admin', 'students'], queryFn: getStudents },
      { queryKey: ['admin', 'instructors'], queryFn: getInstructors },
      { queryKey: ['admin', 'modules'], queryFn: getModules },
      { queryKey: ['admin', 'assignments'], queryFn: getAssignmentsForInstructor },
      { queryKey: ['admin', 'submissions'], queryFn: getAllSubmissions },
      { queryKey: ['admin', 'stats'], queryFn: getAdminStats },
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
