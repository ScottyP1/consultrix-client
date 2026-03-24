import axios, { type AxiosRequestConfig } from 'axios'

import { api, setApiAuthToken } from '@/api/client'
import { getToken, removeAuthSession } from '@/lib/auth-token'

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  tokenType: 'Bearer'
  expiresInSeconds: number
  role: string
}

export interface AuthMeResponse {
  id: number
  email: string
  firstName: string
  lastName: string
}

export interface BaseEntityUser {
  id: number
  firstName: string
  lastName: string
  email: string
  status?: string
  role?: string
}

export interface FacilityEntity {
  id: number
  name?: string
  status?: string
  addressLine1?: string
  city?: string
  state?: string
  country?: string
  capacity?: number
  leaseStartDate?: string | null
  leaseEndDate?: string | null
}

export interface CohortEntity {
  id: number
  name: string
  startDate: string | null
  endDate: string | null
  capacity: number
  status: string
  facility?: FacilityEntity | null
  primaryInstructor?: (BaseEntityUser & {
    title?: string | null
    specialty?: string | null
    officeHours?: string | null
  }) | null
}

export interface InstructorEntity extends BaseEntityUser {
  title?: string | null
  specialty?: string | null
  officeHours?: string | null
}

export interface StudentEntity extends BaseEntityUser {
  cohort?: CohortEntity | null
  graduationStatus?: string | null
  pipelineStage?: string | null
  interviewStage?: string | null
  clientName?: string | null
  placementStartDate?: string | null
  resumeUrl?: string | null
  notes?: string | null
}

export interface ModuleEntity {
  id: number
  title: string
  description?: string | null
  startDate: string | null
  endDate: string | null
  orderIndex: number
  cohort?: CohortEntity | null
}

export interface AssignmentEntity {
  id: number
  title: string
  description?: string | null
  dueDate: string | null
  dueTime: string | null
  maxScore: number
  module: ModuleEntity
}

export interface SubmissionEntity {
  id: number
  submittedAt: string | null
  contentUrl?: string | null
  status: string
  assignment: AssignmentEntity
  student: StudentEntity
}

export interface GradeEntity {
  id: number
  score: number
  feedback?: string | null
  gradedAt: string | null
  submission: SubmissionEntity
  instructor: InstructorEntity
}

export interface AttendanceEntity {
  id: number
  attendanceDate: string
  status: string
  note?: string | null
  cohort: CohortEntity
  student: StudentEntity
}

export interface StudentProfileResponseDto {
  userId: number
  cohortId: number | null
  firstName: string
  lastName: string
  email: string
  role: string
}

export interface AttendanceProfileResponseDto {
  attendanceRate: number
}

export interface AttendanceResponseDto {
  attendanceId: number
  cohortId: number
  studentUserId: number
  attendanceDate: string
  status: string
  note?: string
}

export interface AssignmentResponseDto {
  assignmentId: number
  moduleId: number
  title: string
  description: string
  dueDate: string
  dueTime: string
  maxScore: number
}

export interface StudentCourseworkResponseDto {
  assignmentId: number
  moduleId: number
  moduleTitle: string
  cohortId: number
  cohortName: string
  title: string
  description: string
  dueDate: string | null
  dueTime: string | null
  maxScore: number
  submissionId: number | null
  submittedAt: string | null
  submissionStatus: string | null
  gradeId: number | null
  score: number | null
  assignmentGradePercentage: number | null
  feedback: string | null
  courseworkStatus: 'GRADED' | 'SUBMITTED' | 'LATE' | 'PENDING'
}

export interface GradeProfileResponseDto {
  submissionId: number
  assignmentId: number
  moduleId: number
  overallLetterGrade: string
  overallGradePercentage: number
  moduleGradePercentage: number
  assignmentGradePercentage: number
  score: number
  feedback: string
}

export interface SubmissionResponseDto {
  submissionId: number
  assignmentId: number
  studentUserId: number
  submittedAt: string
  contentUrl: string
  status: string
}

export interface SubmissionRequestDto {
  assignmentId: number
  studentUserId?: number
  submittedAt: string
  contentUrl: string
}

export interface NotificationResponseDto {
  notificationId: number
  userId: number
  title: string
  message: string
  isRead: boolean
}

export interface AttendanceRequestDto {
  cohortId: number
  studentUserId: number
  attendanceDate: string
  status: string
  note?: string
}

export interface GradeRequestDto {
  submissionId: number
  instructorUserId: number
  score: number
  feedback?: string
}

export interface GradeResponseDto {
  gradeId: number
  submissionId: number
  instructorUserId: number
  score: number
  feedback?: string | null
  gradedAt: string | null
}

function handleUnauthorized() {
  removeAuthSession()
  setApiAuthToken(null)

  if (typeof window !== 'undefined' && window.location.pathname !== '/auth/login') {
    window.location.replace('/auth/login')
  }
}

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message =
      typeof error.response?.data?.message === 'string'
        ? error.response.data.message
        : typeof error.response?.data?.error === 'string'
          ? error.response.data.error
          : error.message

    return message || 'Request failed.'
  }

  return error instanceof Error ? error.message : 'Request failed.'
}

export async function request<T>(
  path: string,
  options: AxiosRequestConfig = {},
): Promise<T> {
  const token = getToken()

  try {
    const response = await api.request<T>({
      url: path,
      ...options,
      headers: {
        ...(options.headers ?? {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      handleUnauthorized()
    }

    throw new Error(getErrorMessage(error))
  }
}

export function login(payload: LoginPayload) {
  return request<LoginResponse>('/auth/login', {
    method: 'POST',
    data: payload,
  })
}

export function getMe() {
  return request<AuthMeResponse>('/auth/me')
}

export function getStudents() {
  return request<StudentEntity[]>('/students')
}

export function getStudentsByCohort(cohortId: number) {
  return request<StudentEntity[]>(`/students/cohort/${cohortId}`)
}

export function getModules() {
  return request<ModuleEntity[]>('/modules')
}

export function getModulesByCohort(cohortId: number) {
  return request<ModuleEntity[]>(`/modules/cohort/${cohortId}`)
}

export function getAssignmentsForInstructor() {
  return request<AssignmentEntity[]>('/assignments')
}

export function getAssignmentsByModule(moduleId: number) {
  return request<AssignmentEntity[]>(`/assignments/module/${moduleId}`)
}

export function getStudentProfile() {
  return request<StudentProfileResponseDto>('/students/me')
}

export function getAttendance() {
  return request<AttendanceProfileResponseDto>('/attendance/me')
}

export function getAssignments() {
  return request<AssignmentResponseDto[]>('/assignments/me')
}

export function getStudentCoursework() {
  return request<StudentCourseworkResponseDto[]>('/assignments/me/coursework')
}

export function getGrades() {
  return request<GradeProfileResponseDto[]>('/grades/me')
}

export function getInstructorGrades(instructorUserId: number) {
  return request<GradeEntity[]>(`/grades/instructor/${instructorUserId}`)
}

export function getGradeBySubmission(submissionId: number) {
  return request<GradeEntity[]>(`/grades/submission/${submissionId}`)
}

export function createGrade(payload: GradeRequestDto) {
  return request<GradeResponseDto>('/grades', {
    method: 'POST',
    data: payload,
  })
}

export function updateGrade(gradeId: number, payload: GradeRequestDto) {
  return request<GradeResponseDto>(`/grades/${gradeId}`, {
    method: 'PUT',
    data: payload,
  })
}

export function getAllAttendance() {
  return request<AttendanceEntity[]>('/attendance')
}

export function getAttendanceByStudent(studentId: number) {
  return request<AttendanceEntity[]>(`/attendance/student/${studentId}`)
}

export function createAttendance(payload: AttendanceRequestDto) {
  return request<AttendanceResponseDto>('/attendance', {
    method: 'POST',
    data: payload,
  })
}

export function updateAttendance(
  attendanceId: number,
  payload: AttendanceRequestDto,
) {
  return request<AttendanceResponseDto>(`/attendance/${attendanceId}`, {
    method: 'PUT',
    data: payload,
  })
}

export function getAllSubmissions() {
  return request<SubmissionEntity[]>('/submissions')
}

export function getSubmissionsByAssignment(assignmentId: number) {
  return request<SubmissionEntity[]>(`/submissions/assignment/${assignmentId}`)
}

export function getSubmissionsByStudent(studentUserId: number) {
  return request<SubmissionResponseDto[]>(
    `/submissions/student/${studentUserId}`,
  )
}

export function createSubmission(payload: SubmissionRequestDto) {
  return request<SubmissionResponseDto>('/submissions', {
    method: 'POST',
    data: payload,
  })
}

export function updateSubmission(
  submissionId: number,
  payload: SubmissionRequestDto,
) {
  return request<SubmissionResponseDto>(`/submissions/${submissionId}`, {
    method: 'PUT',
    data: payload,
  })
}

export function getNotifications(userId: number) {
  return request<NotificationResponseDto[]>(`/notifications/user/${userId}`)
}

export function getUnreadNotifications(userId: number) {
  return request<NotificationResponseDto[]>(
    `/notifications/user/${userId}/unread`,
  )
}

export function markNotificationRead(notificationId: number) {
  return request<NotificationResponseDto>(
    `/notifications/${notificationId}/read`,
    {
      method: 'PATCH',
    },
  )
}

export function getCohorts() {
  return request<CohortEntity[]>('/cohorts')
}

export function getFacilities() {
  return request<FacilityEntity[]>('/facilities')
}

export function getInstructors() {
  return request<InstructorEntity[]>('/instructors')
}

export interface AdminStatsDto {
  // counts
  totalStudents: number
  totalInstructors: number
  totalCohorts: number
  totalFacilities: number
  totalModules: number
  totalAssignments: number
  totalSubmissions: number
  totalGrades: number
  // pipeline
  studentsNotStarted: number
  studentsInProgress: number
  studentsPlaced: number
  // graduation
  studentsGradActive: number
  studentsGradCompleted: number
  studentsGradWithdrawn: number
  // interview
  interviewNone: number
  interviewScreen: number
  interviewTechnical: number
  interviewFinal: number
  // cohort status
  cohortsRecruiting: number
  cohortsInterviewing: number
  cohortsActive: number
  cohortsCompleted: number
  cohortsArchived: number
  // submissions
  submissionsSubmitted: number
  submissionsLate: number
  submissionsMissing: number
  submissionsGraded: number
  submissionsUngraded: number
  // grade distribution
  gradeCountA: number
  gradeCountB: number
  gradeCountC: number
  gradeCountD: number
  gradeCountF: number
  platformAvgAssignmentGrade: number | null
  // facilities
  facilitiesActive: number
  facilitiesPlanned: number
  facilitiesClosed: number
}

export function getAdminStats() {
  return request<AdminStatsDto>('/admin/stats')
}

export function getGradesByStudent(studentId: number) {
  return request<GradeProfileResponseDto[]>(`/grades/student/${studentId}`)
}

export function getGradesByAssignment(assignmentId: number) {
  return request<GradeEntity[]>(`/grades/assignment/${assignmentId}`)
}

// ── Student Flags ─────────────────────────────────────────────────────────────

export interface StudentFlagDto {
  id: number
  studentId: number
  studentFirstName: string
  studentLastName: string
  instructorId: number
  instructorFirstName: string
  instructorLastName: string
  reason: string
  /** LOW | MEDIUM | HIGH */
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  resolved: boolean
  resolvedAt: string | null
  createdAt: string
}

export interface StudentFlagRequestDto {
  studentId: number
  reason: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
}

/** Instructor/Admin: flag a student */
export function createFlag(payload: StudentFlagRequestDto) {
  return request<StudentFlagDto>('/flags', { method: 'POST', data: payload })
}

/** Instructor/Admin: resolve an existing flag */
export function resolveFlag(flagId: number) {
  return request<StudentFlagDto>(`/flags/${flagId}/resolve`, { method: 'PATCH' })
}

/** Instructor/Admin: get all flags for a specific student */
export function getFlagsForStudent(studentId: number) {
  return request<StudentFlagDto[]>(`/flags/student/${studentId}`)
}

/** Admin: get all unresolved flags across the platform */
export function getActiveFlags() {
  return request<StudentFlagDto[]>('/flags/active')
}

/** Instructor: get flags they created */
export function getMyFlags() {
  return request<StudentFlagDto[]>('/flags/my')
}

// ── Messaging ─────────────────────────────────────────────────────────────────

export interface UserSummaryDto {
  id: number
  firstName: string
  lastName: string
  role: string
}

export interface MessageDto {
  id: number
  conversationId: number
  sender: UserSummaryDto
  content: string
  deleted: boolean
  sentAt: string
}

export interface ConversationDto {
  id: number
  name: string
  type: 'DIRECT' | 'GROUP'
  members: UserSummaryDto[]
  lastMessage: MessageDto | null
  createdAt: string
}

export interface CreateConversationPayload {
  name?: string
  type: 'DIRECT' | 'GROUP'
  memberIds: number[]
}

export function getConversations() {
  return request<ConversationDto[]>('/conversations')
}

export function createConversation(payload: CreateConversationPayload) {
  return request<ConversationDto>('/conversations', { method: 'POST', data: payload })
}

export function getConversationMessages(conversationId: number) {
  return request<MessageDto[]>(`/conversations/${conversationId}/messages`)
}

export function deleteMessage(messageId: number) {
  return request<void>(`/conversations/messages/${messageId}`, { method: 'DELETE' })
}

// ── Calendar Events ───────────────────────────────────────────────────────────

export interface CalendarEventDto {
  id: number
  title: string
  description?: string | null
  startTime: string
  endTime?: string | null
  eventType: string
  cohortId?: number | null
  cohortName?: string | null
  conversation?: ConversationDto | null
  createdBy: UserSummaryDto
  createdAt: string
}

export interface CreateCalendarEventPayload {
  title: string
  description?: string
  startTime: string
  endTime?: string
  eventType: string
  cohortId?: number
  conversationId?: number
}

export function getCalendarEvents() {
  return request<CalendarEventDto[]>('/calendar/events')
}

export function createCalendarEvent(payload: CreateCalendarEventPayload) {
  return request<CalendarEventDto>('/calendar/events', { method: 'POST', data: payload })
}

export function deleteCalendarEvent(eventId: number) {
  return request<void>(`/calendar/events/${eventId}`, { method: 'DELETE' })
}
