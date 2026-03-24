import type { IconType } from 'react-icons'

export type StatsSectionItem = {
  icon: IconType
  iconBgClassName: string
  iconAccent: string
  label: string
  value: string
}

export type DashboardActionItemData = {
  assignmentId?: number
  to?: string
  title: string
  subTitle: string
  btnLabel: string
  icon: IconType
  iconAccent: string
  iconBg: string
  isLate?: boolean
}

export type DashboardProgressItem = {
  label: string
  value: string
  color: string
  variant?: string
}

export type RecentFeedbackItem = {
  title: string
  from: string
  description: string
  grade: string
}

export type DashboardAnnouncementItem = {
  subject: string
  description: string
}

export type DashboardUpcomingItem = {
  assignment: string
  module: string
  date: string
}

export type DashboardQuickActionItem = {
  title: string
  icon: IconType
  iconAccent: string
  bgColor: string
  to?: string
}
