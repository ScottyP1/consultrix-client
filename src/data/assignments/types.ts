export type StudentAssignmentStatus =
  | 'graded'
  | 'late'
  | 'submitted'
  | 'pending'

export type StudentAssignmentItem = {
  title: string
  subtitle: string
  dueDate: string
  status: StudentAssignmentStatus
}
