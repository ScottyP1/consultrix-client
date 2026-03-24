export type StudentAssignmentStatus =
  | 'graded'
  | 'late'
  | 'submitted'
  | 'pending'

export type StudentAssignmentItem = {
  assignmentId: number
  title: string
  subtitle: string
  dueDate: string
  status: StudentAssignmentStatus
}
