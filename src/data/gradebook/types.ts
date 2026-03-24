export type GradebookStatus = 'missing' | 'submitted' | 'graded' | 'excused'

export type GradebookStudent = {
  id: string
  name: string
  email: string
}

export type GradebookModule = {
  id: string
  title: string
  order: number
}

export type GradebookAssignment = {
  id: string
  moduleId: string
  title: string
  pointsPossible: number
  dueDate: string
  order: number
}

export type GradebookRecord = {
  studentId: string
  assignmentId: string
  submissionId?: number
  gradeId?: number
  score: number | null
  status: GradebookStatus
  feedback?: string
  updatedAt?: string
}

export type GradebookCohort = {
  id: string
  name: string
  term: string
  students: GradebookStudent[]
  modules: GradebookModule[]
  assignments: GradebookAssignment[]
  records: GradebookRecord[]
}
