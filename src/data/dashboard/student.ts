import {
  LuAward,
  LuBookOpen,
  LuCalendar,
  LuClock,
  LuClock3,
  LuClipboardCheck,
  LuMessageCircleWarning,
  LuMessageSquare,
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

export const studentStats: StatsSectionItem[] = [
  {
    icon: LuAward,
    iconBgClassName: '#25254C',
    iconAccent: '#7177FB',
    label: 'Current Grade',
    value: '97.5',
  },
  {
    icon: LuUser,
    iconBgClassName: '#25254C',
    iconAccent: '#C27Aff',
    label: 'Attendance',
    value: '99%',
  },
  {
    icon: LuClipboardCheck,
    iconBgClassName: '#113745',
    iconAccent: '#0C8CE9',
    label: 'Tickets',
    value: '2',
  },
  {
    icon: LuClock3,
    iconBgClassName: '#461524',
    iconAccent: '#FF4D61',
    label: 'Past Due',
    value: '2',
  },
]

export const studentActionItems: DashboardActionItemData[] = [
  {
    icon: LuClock,
    iconAccent: '#FEAF15',
    iconBg: '#47311B',
    title: 'Node.js Final Project Due Soon',
    subTitle: 'Submit by Feb 20, 2026 - 11:59 PM',
    btnLabel: 'Submit',
  },
  {
    icon: LuMessageCircleWarning,
    iconAccent: '#FF4D61',
    iconBg: '#461524',
    title: 'Missing Attendance - React Workshop',
    subTitle: 'Contact instructor for makeup session',
    btnLabel: 'Review',
  },
  {
    icon: LuClock,
    iconAccent: '#FEAF15',
    iconBg: '#47311B',
    title: 'SQL KBA Due Soon',
    subTitle: 'Submit by Feb 24, 2026 - 11:59 PM',
    btnLabel: 'Submit',
  },
]

export const studentProgressItems: DashboardProgressItem[] = [
  {
    label: 'Javascript',
    value: '85%',
    color: 'bg-linear-to-r from-cyan-500 to-blue-500',
    variant: 'Dashboard',
  },
  {
    label: 'React',
    value: '60%',
    color: 'bg-linear-to-t from-sky-500 to-indigo-500',
    variant: 'Dashboard',
  },
  {
    label: 'Java',
    value: '45%',
    color: 'bg-linear-to-bl from-violet-500 to-fuchsia-500',
    variant: 'Dashboard',
  },
  {
    label: 'SpringBoot',
    value: '30%',
    color: 'bg-linear-65 from-purple-500 to-pink-500',
    variant: 'Dashboard',
  },
  {
    label: 'Java',
    value: '45%',
    color: 'bg-linear-to-bl from-violet-500 to-fuchsia-500',
    variant: 'Dashboard',
  },
  {
    label: 'SpringBoot',
    value: '30%',
    color: 'bg-linear-65 from-purple-500 to-pink-500',
    variant: 'Dashboard',
  },
]

export const studentRecentFeedbackItems: RecentFeedbackItem[] = [
  {
    title: 'React SBA',
    from: 'Allan',
    description: 'Great Work',
    grade: 'B',
  },
  {
    title: 'Java SBA',
    from: 'Allan',
    description: 'Excellent',
    grade: 'A',
  },
]

export const studentAnnouncements: DashboardAnnouncementItem[] = [
  {
    subject: 'Lesson Plan 3/11 Intro to SQL',
    description:
      'Getting started with SQL: Understanding Databases and Queries',
  },
  { subject: 'SBA Review', description: 'SBA Review' },
  {
    subject: 'Request preferred method',
    description:
      'Hi everyone, for any requests you can reach out to me via direct message.',
  },
]

export const studentUpcomingItems: DashboardUpcomingItem[] = [
  {
    assignment: 'Node.js Final Project',
    module: '308',
    date: 'Feb 23, 2026',
  },
  {
    assignment: 'React Quiz 3',
    module: '410',
    date: 'Feb 25, 2026',
  },
  {
    assignment: 'SQL KBA',
    module: '309',
    date: 'Feb 27, 2026',
  },
]

export const studentQuickActions: DashboardQuickActionItem[] = [
  {
    icon: LuMessageSquare,
    title: 'Message Instructor',
    bgColor: '#26254B',
    iconAccent: '#99A8FD',
  },
  {
    icon: LuBookOpen,
    title: 'Browse Resources',
    bgColor: '#341E4C',
    iconAccent: '#AC84D3',
  },
  {
    icon: LuCalendar,
    title: 'Schedule Study Session',
    bgColor: '#143A43',
    iconAccent: '#4ADEED',
  },
]
