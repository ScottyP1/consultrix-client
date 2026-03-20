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
      },
      {
        queryKey: ['instructor', 'students'],
        queryFn: getStudents,
      },
      {
        queryKey: ['instructor', 'modules'],
        queryFn: getModules,
      },
      {
        queryKey: ['instructor', 'assignments'],
        queryFn: getAssignmentsForInstructor,
      },
      {
        queryKey: ['instructor', 'submissions'],
        queryFn: getAllSubmissions,
      },
      {
        queryKey: ['instructor', 'attendance'],
        queryFn: getAllAttendance,
      },
      {
        queryKey: ['instructor', 'notifications'],
        queryFn: async () => {
          const me = await getMe()
          return getNotifications(me.id)
        },
      },
      {
        queryKey: ['instructor', 'grades'],
        queryFn: async () => {
          const me = await getMe()
          return getInstructorGrades(me.id)
        },
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
