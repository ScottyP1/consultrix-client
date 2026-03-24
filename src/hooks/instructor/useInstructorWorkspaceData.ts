import { useQueries } from '@tanstack/react-query'

import {
  getAllAttendance,
  getAllSubmissions,
  getAssignmentsForInstructor,
  getMe,
  getModules,
  getNotifications,
  getStudents,
  getInstructorGrades,
} from '@/api/consultrix'

const REF = 1000 * 60 * 30  // 30 min — reference data
const LIVE = 1000 * 60 * 5   // 5 min  — operational data (default, explicit for clarity)
const NOTIF = 1000 * 60      // 1 min  — notifications

export function useInstructorWorkspaceData() {
  const [
    meQuery,
    studentsQuery,
    modulesQuery,
    assignmentsQuery,
    submissionsQuery,
    attendanceQuery,
    notificationsQuery,
    gradesQuery,
  ] = useQueries({
    queries: [
      {
        queryKey: ['auth', 'me'],
        queryFn: getMe,
        staleTime: Infinity,
      },
      {
        queryKey: ['instructor', 'students'],
        queryFn: getStudents,
        staleTime: REF,
      },
      {
        queryKey: ['instructor', 'modules'],
        queryFn: getModules,
        staleTime: REF,
      },
      {
        queryKey: ['instructor', 'assignments'],
        queryFn: getAssignmentsForInstructor,
        staleTime: REF,
      },
      {
        queryKey: ['instructor', 'submissions'],
        queryFn: getAllSubmissions,
        staleTime: LIVE,
      },
      {
        queryKey: ['instructor', 'attendance'],
        queryFn: getAllAttendance,
        staleTime: LIVE,
      },
      {
        queryKey: ['instructor', 'notifications'],
        queryFn: async () => {
          const me = await getMe()
          return getNotifications(me.id)
        },
        staleTime: NOTIF,
      },
      {
        queryKey: ['instructor', 'grades'],
        queryFn: async () => {
          const me = await getMe()
          return getInstructorGrades(me.id)
        },
        staleTime: LIVE,
      },
    ],
  })

  return {
    meQuery,
    studentsQuery,
    modulesQuery,
    assignmentsQuery,
    submissionsQuery,
    attendanceQuery,
    notificationsQuery,
    gradesQuery,
    isLoading: [
      meQuery,
      studentsQuery,
      modulesQuery,
      assignmentsQuery,
      submissionsQuery,
      attendanceQuery,
      notificationsQuery,
      gradesQuery,
    ].some((query) => query.isLoading),
    error:
      meQuery.error ??
      studentsQuery.error ??
      modulesQuery.error ??
      assignmentsQuery.error ??
      submissionsQuery.error ??
      attendanceQuery.error ??
      notificationsQuery.error ??
      gradesQuery.error ??
      null,
  }
}
