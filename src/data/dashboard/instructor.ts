import {
  LuBookOpen,
  LuCalendar,
  LuCircleCheck,
  LuFileInput,
  LuMessageCircleWarning,
  LuTriangleAlert,
  LuUser,
} from 'react-icons/lu'

import type {
  DashboardActionItemData,
  DashboardAnnouncementItem,
  DashboardProgressItem,
  DashboardQuickActionItem,
  DashboardUpcomingItem,
  RecentFeedbackItem,
  StatsSectionItem,
} from './types'

export const instructorStats: StatsSectionItem[] = [
  {
    icon: LuUser,
    iconBgClassName: '#25254C',
    iconAccent: '#7177FB',
    label: 'Active Students',
    value: '25',
  },
  {
    icon: LuTriangleAlert,
    iconBgClassName: '#461524',
    iconAccent: '#FF4D61',
    label: 'At Risk Students',
    value: '3',
  },
  {
    icon: LuFileInput,
    iconBgClassName: '#47311B',
    iconAccent: '#FEAF15',
    label: 'Pending Submissions',
    value: '15',
  },
  {
    icon: LuCircleCheck,
    iconBgClassName: '#143E2A',
    iconAccent: '#17E071',
    label: 'Avg Grade',
    value: '89%',
  },
]

export const instructorActionItems: DashboardActionItemData[] = [
  {
    icon: LuTriangleAlert,
    iconAccent: '#FF4D61',
    iconBg: '#461524',
    title: 'John Doe',
    subTitle: 'Low Attendance (60%)',
    btnLabel: 'Contact',
  },
  {
    icon: LuTriangleAlert,
    iconAccent: '#FF4D61',
    iconBg: '#461524',
    title: 'Jane Smith',
    subTitle: 'Failing grade (55%)',
    btnLabel: 'Contact',
  },
  {
    icon: LuTriangleAlert,
    iconAccent: '#FEAF15',
    iconBg: '#47311B',
    title: 'Mike Johnson',
    subTitle: 'Missing assignments',
    btnLabel: 'Contact',
  },
]

export const instructorProgressItems: DashboardProgressItem[] = [
  {
    label: 'Cohort Completion',
    value: '82%',
    color: 'bg-linear-to-r from-cyan-500 to-blue-500',
    variant: 'Dashboard',
  },
  {
    label: 'Assignment Pass Rate',
    value: '76%',
    color: 'bg-linear-to-t from-sky-500 to-indigo-500',
    variant: 'Dashboard',
  },
  {
    label: 'Attendance Health',
    value: '91%',
    color: 'bg-linear-to-bl from-violet-500 to-fuchsia-500',
    variant: 'Dashboard',
  },
  {
    label: 'Ticket Resolution',
    value: '68%',
    color: 'bg-linear-65 from-purple-500 to-pink-500',
    variant: 'Dashboard',
  },
]

export const instructorRecentActivityItems: RecentFeedbackItem[] = [
  {
    title: 'React SBA Submitted',
    from: 'Jordan P.',
    description: 'New submission is ready for instructor review.',
    grade: '1',
  },
  {
    title: 'Attendance Alert Triggered',
    from: 'Mia R.',
    description: 'Student has missed two sessions this week.',
    grade: '2',
  },
]

export const instructorAnnouncements: DashboardAnnouncementItem[] = [
  {
    subject: 'Cohort 12 pacing review',
    description: 'Submit module pacing adjustments before Friday.',
  },
  {
    subject: 'Attendance escalation window',
    description: 'Flag students with two or more misses by end of day.',
  },
  {
    subject: 'Submission backlog reminder',
    description: 'Complete grading on outstanding assignments this week.',
  },
]

export const instructorUpcomingItems: DashboardUpcomingItem[] = [
  {
    assignment: 'Grade React SBA Batch',
    module: '410',
    date: 'Feb 24, 2026',
  },
  {
    assignment: 'Instructor Office Hours',
    module: 'Cohort 12',
    date: 'Feb 25, 2026',
  },
  {
    assignment: 'Attendance Review Sync',
    module: 'Ops',
    date: 'Feb 26, 2026',
  },
]

export const instructorQuickActions: DashboardQuickActionItem[] = [
  {
    icon: LuMessageCircleWarning,
    title: 'Message Cohort',
    bgColor: '#26254B',
    iconAccent: '#99A8FD',
  },
  {
    icon: LuBookOpen,
    title: 'Open Gradebook',
    bgColor: '#341E4C',
    iconAccent: '#AC84D3',
    to: '/instructor/gradebook',
  },
  {
    icon: LuCalendar,
    title: 'Plan Session',
    bgColor: '#143A43',
    iconAccent: '#4ADEED',
  },
]
