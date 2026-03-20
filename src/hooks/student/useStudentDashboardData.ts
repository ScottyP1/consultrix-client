import { useStudentAssignments } from './useStudentAssignments'
import { useStudentAttendance } from './useStudentAttendance'
import { useStudentGrades } from './useStudentGrades'
import { useStudentNotifications } from './useStudentNotifications'
import { useStudentProfile } from './useStudentProfile'

export function useStudentDashboardData() {
  const profileQuery = useStudentProfile()
  const attendanceQuery = useStudentAttendance()
  const assignmentsQuery = useStudentAssignments()
  const gradesQuery = useStudentGrades()
  const notificationsQuery = useStudentNotifications(profileQuery.data?.userId)

  return {
    profileQuery,
    attendanceQuery,
    assignmentsQuery,
    gradesQuery,
    notificationsQuery,
    isLoading:
      profileQuery.isLoading ||
      attendanceQuery.isLoading ||
      assignmentsQuery.isLoading ||
      gradesQuery.isLoading ||
      notificationsQuery.isLoading,
    error:
      profileQuery.error ??
      attendanceQuery.error ??
      assignmentsQuery.error ??
      gradesQuery.error ??
      notificationsQuery.error ??
      null,
  }
}
