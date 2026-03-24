export type AttendanceStatus = 'present' | 'late' | 'absent' | 'excused'

export type AttendanceStudent = {
  id: string
  name: string
  email: string
}

export type AttendanceSession = {
  id: string
  label: string
  date: string
  topic: string
}

export type AttendanceRecord = {
  studentId: string
  sessionId: string
  attendanceId?: number
  status: AttendanceStatus
  note?: string
}

export type AttendanceCohort = {
  id: string
  name: string
  term: string
  students: AttendanceStudent[]
  sessions: AttendanceSession[]
  records: AttendanceRecord[]
}
