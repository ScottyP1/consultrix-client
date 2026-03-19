import type { StudentAssignmentItem } from './types'

export const studentAssignmentFilters = [
  'All',
  'Pending',
  'Submitted',
  'Graded',
] as const

export const studentAssignments: StudentAssignmentItem[] = [
  {
    title: 'Node.js SBA',
    subtitle: 'Module name',
    dueDate: 'Feb 20, 2026',
    status: 'graded',
  },
  {
    title: 'SQL KBA',
    subtitle: 'Module name',
    dueDate: 'Feb 20, 2026',
    status: 'late',
  },
  {
    title: 'React Quiz 3',
    subtitle: 'Module name',
    dueDate: 'Feb 20, 2026',
    status: 'submitted',
  },
  {
    title: 'Web foundations GLAB',
    subtitle: 'Module name',
    dueDate: 'Feb 20, 2026',
    status: 'pending',
  },
]
