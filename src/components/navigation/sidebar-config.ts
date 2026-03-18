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
  { title: 'Dashboard', icon: LayoutGrid, href: '/user/dashboard' },
  { title: 'Syllabus', icon: BookOpen, href: '/user/syllabus' },
  { title: 'Grades', icon: GraduationCap, href: '/user/grades' },
  { title: 'Assignments', icon: FileText, href: '/user/assignments' },
  { title: 'Calendar', icon: CalendarDays, href: '/user/calendar' },
  { title: 'Messages', icon: MessageSquareText, href: '/user/messages' },
  { title: 'Profile', icon: UserCircle2, href: '/user/profile' },
]
