import {
  BookOpen,
  CalendarDays,
  FileText,
  GraduationCap,
  LayoutGrid,
  MessageSquareText,
  UserCircle2,
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
