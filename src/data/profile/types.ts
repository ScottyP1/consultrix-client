import type { IconType } from 'react-icons'
import type { LucideIcon } from 'lucide-react'

export type ProfileAvatarData = {
  name: string
  subtitle: string
  buttonLabel: string
  avatarLabel?: string
}

export type ProfileContactItem = {
  icon: LucideIcon
  label: string
  value: string
}

export type ProfileInfoItem = {
  title: string
  subtitle: string
}

export type ProfileMetricItem = {
  title: string
  value: string
  color: string
  icon?: IconType
}

export type ProfileData = {
  eyebrow: string
  subtitle: string
  avatar: ProfileAvatarData
  contacts: ProfileContactItem[]
  cohortInfoTitle: string
  cohortInfo: ProfileInfoItem[]
  metricsTitle: string
  metrics: ProfileMetricItem[]
  skills: string[]
}
