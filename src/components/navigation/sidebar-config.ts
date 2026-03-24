import {
  BookOpen,
  Building2,
  CalendarDays,
  FileText,
  GraduationCap,
  LayoutGrid,
  MessageSquareText,
  UserCircle2,
  User2Icon,
  ClipboardList,
  UserRoundCheck,
  SquareCheck,
  Users,
  type LucideIcon,
} from 'lucide-react'

export type SideBarLink = {
  title: string
  icon: LucideIcon
  href: string
}

export const studentNavLinks: SideBarLink[] = [
  { title: 'Dashboard', icon: LayoutGrid, href: '/student/dashboard' },
  { title: 'Syllabus', icon: BookOpen, href: '/student/syllabus' },
  { title: 'Grades', icon: GraduationCap, href: '/student/grades' },
  { title: 'Assignments', icon: FileText, href: '/student/assignments' },
  { title: 'Calendar', icon: CalendarDays, href: '/student/calendar' },
  { title: 'Messages', icon: MessageSquareText, href: '/student/messages' },
  { title: 'Profile', icon: UserCircle2, href: '/student/profile' },
]

export const adminNavLinks: SideBarLink[] = [
  { title: 'Dashboard', icon: LayoutGrid, href: '/admin/dashboard' },
  { title: 'Facilities', icon: Building2, href: '/admin/facilities' },
  { title: 'Cohorts', icon: Users, href: '/admin/cohorts' },
  { title: 'Students', icon: GraduationCap, href: '/admin/students' },
  { title: 'Instructors', icon: UserRoundCheck, href: '/admin/instructors' },
]

export const instructorNavLinks: SideBarLink[] = [
  { title: 'Dashboard', icon: LayoutGrid, href: '/instructor/dashboard' },
  { title: 'Cohorts', icon: User2Icon, href: '/instructor/cohorts' },
  {
    title: 'Assignments',
    icon: ClipboardList,
    href: '/instructor/assignments',
  },
  { title: 'Submissions', icon: SquareCheck, href: '/instructor/submissions' },
  { title: 'Gradebook', icon: GraduationCap, href: '/instructor/gradebook' },
  {
    title: 'Attendance',
    icon: UserRoundCheck,
    href: '/instructor/attendance',
  },
  { title: 'Messages', icon: MessageSquareText, href: '/instructor/messages' },
  { title: 'Profile', icon: UserCircle2, href: '/instructor/profile' },
]
